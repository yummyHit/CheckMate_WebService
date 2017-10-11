/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RemoteStore = undefined;

var _snapshot_version = require('../core/snapshot_version');

var _transaction = require('../core/transaction');

var _types = require('../core/types');

var _query_data = require('../local/query_data');

var _document = require('../model/document');

var _document_key = require('../model/document_key');

var _mutation_batch = require('../model/mutation_batch');

var _platform = require('../platform/platform');

var _assert = require('../util/assert');

var _error = require('../util/error');

var _log = require('../util/log');

var log = _interopRequireWildcard(_log);

var _obj = require('../util/obj');

var objUtils = _interopRequireWildcard(_obj);

var _promise = require('../../utils/promise');

var _remote_event = require('./remote_event');

var _rpc_error = require('./rpc_error');

var _watch_change = require('./watch_change');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var LOG_TAG = 'RemoteStore';
// TODO(b/35853402): Negotiate this with the stream.
var MAX_PENDING_WRITES = 10;
// The RemoteStore notifies an onlineStateHandler with OnlineState.Failed if we
// fail to connect to the backend. This subsequently triggers get() requests to
// fail or use cached data, etc. Unfortunately, our connections have
// historically been subject to various transient failures. So we wait for
// multiple failures before notifying the onlineStateHandler.
var ONLINE_ATTEMPTS_BEFORE_FAILURE = 2;
/**
 * RemoteStore - An interface to remotely stored data, basically providing a
 * wrapper around the Datastore that is more reliable for the rest of the
 * system.
 *
 * RemoteStore is responsible for maintaining the connection to the server.
 * - maintaining a list of active listens.
 * - reconnecting when the connection is dropped.
 * - resuming all the active listens on reconnect.
 *
 * RemoteStore handles all incoming events from the Datastore.
 * - listening to the watch stream and repackaging the events as RemoteEvents
 * - notifying SyncEngine of any changes to the active listens.
 *
 * RemoteStore takes writes from other components and handles them reliably.
 * - pulling pending mutations from LocalStore and sending them to Datastore.
 * - retrying mutations that failed because of network problems.
 * - acking mutations to the SyncEngine once they are accepted or rejected.
 */
var RemoteStore = /** @class */function () {
    function RemoteStore(databaseInfo, asyncQueue,
    /**
     * The local store, used to fill the write pipeline with outbound
     * mutations and resolve existence filter mismatches.
     */
    localStore,
    /** The client-side proxy for interacting with the backend. */
    datastore, onlineStateHandler) {
        this.databaseInfo = databaseInfo;
        this.asyncQueue = asyncQueue;
        this.localStore = localStore;
        this.datastore = datastore;
        this.onlineStateHandler = onlineStateHandler;
        this.pendingWrites = [];
        this.lastBatchSeen = _mutation_batch.BATCHID_UNKNOWN;
        /**
         * A mapping of watched targets that the client cares about tracking and the
         * user has explicitly called a 'listen' for this target.
         *
         * These targets may or may not have been sent to or acknowledged by the
         * server. On re-establishing the listen stream, these targets should be sent
         * to the server. The targets removed with unlistens are removed eagerly
         * without waiting for confirmation from the listen stream.
         */
        this.listenTargets = {};
        /**
         * A mapping of targetId to pending acks needed.
         *
         * If a targetId is present in this map, then we're waiting for watch to
         * acknowledge a removal or addition of the target. If a target is not in this
         * mapping, and it's in the listenTargets map, then we consider the target to
         * be active.
         *
         * We increment the count here every time we issue a request over the stream
         * to watch or unwatch. We then decrement the count every time we get a target
         * added or target removed message from the server. Once the count is equal to
         * 0 we know that the client and server are in the same state (once this state
         * is reached the targetId is removed from the map to free the memory).
         */
        this.pendingTargetResponses = {};
        this.accumulatedWatchChanges = [];
        /**
         * The online state of the watch stream. The state is set to healthy if and
         * only if there are messages received by the backend.
         */
        this.watchStreamOnlineState = _types.OnlineState.Unknown;
        /** A count of consecutive failures to open the stream. */
        this.watchStreamFailures = 0;
    }
    /**
     * Starts up the remote store, creating streams, restoring state from
     * LocalStore, etc.
     */
    RemoteStore.prototype.start = function () {
        var _this = this;
        return this.setupStreams().then(function () {
            // Resume any writes
            return _this.fillWritePipeline();
        });
    };
    RemoteStore.prototype.setOnlineStateToHealthy = function () {
        this.updateAndBroadcastOnlineState(_types.OnlineState.Healthy);
    };
    RemoteStore.prototype.setOnlineStateToUnknown = function () {
        // The state is set to unknown when a healthy stream is closed (e.g. due to
        // a token timeout) or when we have no active listens and therefore there's
        // no need to start the stream. Assuming there is (possibly in the future)
        // an active listen, then we will eventually move to state Online or Failed,
        // but we always want to make at least ONLINE_ATTEMPTS_BEFORE_FAILURE
        // attempts before failing, so we reset the count here.
        this.watchStreamFailures = 0;
        this.updateAndBroadcastOnlineState(_types.OnlineState.Unknown);
    };
    RemoteStore.prototype.updateOnlineStateAfterFailure = function () {
        // The first failure after we are successfully connected moves us to the
        // 'Unknown' state. We then may make multiple attempts (based on
        // ONLINE_ATTEMPTS_BEFORE_FAILURE) before we actually report failure.
        if (this.watchStreamOnlineState === _types.OnlineState.Healthy) {
            this.setOnlineStateToUnknown();
        } else {
            this.watchStreamFailures++;
            if (this.watchStreamFailures >= ONLINE_ATTEMPTS_BEFORE_FAILURE) {
                this.updateAndBroadcastOnlineState(_types.OnlineState.Failed);
            }
        }
    };
    RemoteStore.prototype.updateAndBroadcastOnlineState = function (onlineState) {
        var didChange = this.watchStreamOnlineState !== onlineState;
        this.watchStreamOnlineState = onlineState;
        if (didChange) {
            this.onlineStateHandler(onlineState);
        }
    };
    RemoteStore.prototype.setupStreams = function () {
        var _this = this;
        this.watchStream = this.datastore.newPersistentWatchStream({
            onOpen: this.onWatchStreamOpen.bind(this),
            onClose: this.onWatchStreamClose.bind(this),
            onWatchChange: this.onWatchStreamChange.bind(this)
        });
        this.writeStream = this.datastore.newPersistentWriteStream({
            onOpen: this.onWriteStreamOpen.bind(this),
            onClose: this.onWriteStreamClose.bind(this),
            onHandshakeComplete: this.onWriteHandshakeComplete.bind(this),
            onMutationResult: this.onMutationResult.bind(this)
        });
        // Load any saved stream token from persistent storage
        return this.localStore.getLastStreamToken().then(function (token) {
            _this.writeStream.lastStreamToken = token;
        });
    };
    RemoteStore.prototype.shutdown = function () {
        log.debug(LOG_TAG, 'RemoteStore shutting down.');
        this.cleanupWatchStreamState();
        this.writeStream.stop();
        this.watchStream.stop();
        return _promise.PromiseImpl.resolve(undefined);
    };
    /** Starts new listen for the given query. Uses resume token if provided */
    RemoteStore.prototype.listen = function (queryData) {
        (0, _assert.assert)(!objUtils.contains(this.listenTargets, queryData.targetId), 'listen called with duplicate targetId!');
        // Mark this as something the client is currently listening for.
        this.listenTargets[queryData.targetId] = queryData;
        if (this.watchStream.isOpen()) {
            this.sendWatchRequest(queryData);
        } else if (!this.watchStream.isStarted()) {
            // The listen will be sent in onWatchStreamOpen
            this.startWatchStream();
        }
    };
    /** Removes the listen from server */
    RemoteStore.prototype.unlisten = function (targetId) {
        (0, _assert.assert)(objUtils.contains(this.listenTargets, targetId), 'unlisten called without assigned target ID!');
        var queryData = this.listenTargets[targetId];
        delete this.listenTargets[targetId];
        if (this.watchStream.isOpen()) {
            this.sendUnwatchRequest(targetId);
        }
    };
    /**
     * We need to increment the the expected number of pending responses we're due
     * from watch so we wait for the ack to process any messages from this target.
     */
    RemoteStore.prototype.sendWatchRequest = function (queryData) {
        this.recordPendingTargetRequest(queryData.targetId);
        this.watchStream.watch(queryData);
    };
    /**
     * We need to increment the expected number of pending responses we're due
     * from watch so we wait for the removal on the server before we process any
     * messages from this target.
     */
    RemoteStore.prototype.sendUnwatchRequest = function (targetId) {
        this.recordPendingTargetRequest(targetId);
        this.watchStream.unwatch(targetId);
    };
    /**
     * Increment the mapping of how many acks are needed from watch before we can
     * consider the server to be 'in-sync' with the client's active targets.
     */
    RemoteStore.prototype.recordPendingTargetRequest = function (targetId) {
        // For each request we get we need to record we need a response for it.
        this.pendingTargetResponses[targetId] = (this.pendingTargetResponses[targetId] || 0) + 1;
    };
    RemoteStore.prototype.startWatchStream = function () {
        (0, _assert.assert)(!this.watchStream.isStarted(), "Can't restart started watch stream");
        (0, _assert.assert)(this.shouldStartWatchStream(), 'Tried to start watch stream even though it should not be started');
        this.watchStream.start();
    };
    /**
     * Returns whether the watch stream should be started because there are
     * active targets trying to be listened too
     */
    RemoteStore.prototype.shouldStartWatchStream = function () {
        return !objUtils.isEmpty(this.listenTargets);
    };
    RemoteStore.prototype.cleanupWatchStreamState = function () {
        // If the connection is closed then we'll never get a snapshot version for
        // the accumulated changes and so we'll never be able to complete the batch.
        // When we start up again the server is going to resend these changes
        // anyway, so just toss the accumulated state.
        this.accumulatedWatchChanges = [];
        this.pendingTargetResponses = {};
    };
    RemoteStore.prototype.onWatchStreamOpen = function () {
        var _this = this;
        // TODO(b/35852690): close the stream again (with some timeout?) if no watch
        // targets are active
        objUtils.forEachNumber(this.listenTargets, function (targetId, queryData) {
            _this.sendWatchRequest(queryData);
        });
        return _promise.PromiseImpl.resolve();
    };
    RemoteStore.prototype.onWatchStreamClose = function (error) {
        this.cleanupWatchStreamState();
        // If there was an error, retry the connection.
        if (this.shouldStartWatchStream()) {
            this.updateOnlineStateAfterFailure();
            this.startWatchStream();
        } else {
            // No need to restart watch stream because there are no active targets.
            // The online state is set to unknown because there is no active attempt
            // at establishing a connection
            this.setOnlineStateToUnknown();
        }
        return _promise.PromiseImpl.resolve();
    };
    RemoteStore.prototype.onWatchStreamChange = function (watchChange, snapshotVersion) {
        // Mark the connection as healthy because we got a message from the server
        this.setOnlineStateToHealthy();
        if (watchChange instanceof _watch_change.WatchTargetChange && watchChange.state === _watch_change.WatchTargetChangeState.Removed && watchChange.cause) {
            // There was an error on a target, don't wait for a consistent snapshot
            // to raise events
            return this.handleTargetError(watchChange);
        }
        // Accumulate watch changes but don't process them if there's no
        // snapshotVersion or it's older than a previous snapshot we've processed
        // (can happen after we resume a target using a resume token).
        this.accumulatedWatchChanges.push(watchChange);
        if (!snapshotVersion.equals(_snapshot_version.SnapshotVersion.MIN) && snapshotVersion.compareTo(this.localStore.getLastRemoteSnapshotVersion()) >= 0) {
            var changes = this.accumulatedWatchChanges;
            this.accumulatedWatchChanges = [];
            return this.handleWatchChangeBatch(snapshotVersion, changes);
        } else {
            return _promise.PromiseImpl.resolve();
        }
    };
    /**
     * Takes a batch of changes from the Datastore, repackages them as a
     * RemoteEvent, and passes that on to the listener, which is typically the
     * SyncEngine.
     */
    RemoteStore.prototype.handleWatchChangeBatch = function (snapshotVersion, changes) {
        var _this = this;
        var aggregator = new _watch_change.WatchChangeAggregator(snapshotVersion, this.listenTargets, this.pendingTargetResponses);
        aggregator.addChanges(changes);
        var remoteEvent = aggregator.createRemoteEvent();
        // Get the new response counts from the aggregator
        this.pendingTargetResponses = aggregator.pendingTargetResponses;
        var promises = [];
        // Handle existence filters and existence filter mismatches.
        objUtils.forEachNumber(aggregator.existenceFilters, function (targetId, filter) {
            var queryData = _this.listenTargets[targetId];
            if (!queryData) {
                // A watched target might have been removed already.
                return;
            }
            var query = queryData.query;
            if (query.isDocumentQuery()) {
                if (filter.count === 0) {
                    // The existence filter told us the document does not exist.
                    // We need to deduce that this document does not exist and apply
                    // a deleted document to our updates. Without applying a deleted
                    // document there might be another query that will raise this
                    // document as part of a snapshot until it is resolved,
                    // essentially exposing inconsistency between queries.
                    var key = new _document_key.DocumentKey(query.path);
                    var deletedDoc = new _document.NoDocument(key, snapshotVersion);
                    remoteEvent.addDocumentUpdate(deletedDoc);
                } else {
                    (0, _assert.assert)(filter.count === 1, 'Single document existence filter with count: ' + filter.count);
                }
            } else {
                // Not a document query.
                var promise = _this.localStore.remoteDocumentKeys(targetId).then(function (trackedRemote) {
                    if (remoteEvent.targetChanges[targetId]) {
                        var mapping = remoteEvent.targetChanges[targetId].mapping;
                        if (mapping !== null) {
                            if (mapping instanceof _remote_event.UpdateMapping) {
                                trackedRemote = mapping.applyToKeySet(trackedRemote);
                            } else {
                                (0, _assert.assert)(mapping instanceof _remote_event.ResetMapping, 'Expected either reset or update mapping but got something else: ' + mapping);
                                trackedRemote = mapping.documents;
                            }
                        }
                    }
                    if (trackedRemote.size !== filter.count) {
                        // Existence filter mismatch, resetting mapping.
                        // Make sure the mismatch is exposed in the remote event.
                        remoteEvent.handleExistenceFilterMismatch(targetId);
                        // Clear the resume token for the query, since we're in a
                        // known mismatch state.
                        var newQueryData = new _query_data.QueryData(query, targetId, queryData.purpose);
                        _this.listenTargets[targetId] = newQueryData;
                        // Cause a hard reset by unwatching and rewatching
                        // immediately, but deliberately don't send a resume token
                        // so that we get a full update.
                        // Make sure we expect that this acks are going to happen.
                        _this.sendUnwatchRequest(targetId);
                        // Mark the query we send as being on behalf of an existence
                        // filter mismatch, but don't actually retain that in
                        // listenTargets. This ensures that we flag the first
                        // re-listen this way without impacting future listens of
                        // this target (that might happen e.g. on reconnect).
                        var requestQueryData = new _query_data.QueryData(query, targetId, _query_data.QueryPurpose.ExistenceFilterMismatch);
                        _this.sendWatchRequest(requestQueryData);
                    }
                });
                promises.push(promise);
            }
        });
        return _promise.PromiseImpl.all(promises).then(function () {
            // Update in-memory resume tokens. LocalStore will update the
            // persistent view of these when applying the completed RemoteEvent.
            objUtils.forEachNumber(remoteEvent.targetChanges, function (targetId, change) {
                if (change.resumeToken.length > 0) {
                    var queryData = _this.listenTargets[targetId];
                    // A watched target might have been removed already.
                    if (queryData) {
                        _this.listenTargets[targetId] = queryData.update({
                            resumeToken: change.resumeToken,
                            snapshotVersion: change.snapshotVersion
                        });
                    }
                }
            });
            // Finally handle remote event
            return _this.syncEngine.applyRemoteEvent(remoteEvent);
        });
    };
    /** Handles an error on a target */
    RemoteStore.prototype.handleTargetError = function (watchChange) {
        var _this = this;
        (0, _assert.assert)(!!watchChange.cause, 'Handling target error without a cause');
        var error = watchChange.cause;
        var promiseChain = _promise.PromiseImpl.resolve();
        watchChange.targetIds.forEach(function (targetId) {
            promiseChain = promiseChain.then(function () {
                if (objUtils.contains(_this.listenTargets, targetId)) {
                    delete _this.listenTargets[targetId];
                    return _this.syncEngine.rejectListen(targetId, error);
                } else {
                    // A watched target might have been removed already.
                    return _promise.PromiseImpl.resolve();
                }
            });
        });
        return promiseChain;
    };
    /**
     * Notifies that there are new mutations to process in the queue. This is
     * typically called by SyncEngine after it has sent mutations to LocalStore.
     *
     */
    RemoteStore.prototype.fillWritePipeline = function () {
        var _this = this;
        if (!this.canWriteMutations()) {
            return _promise.PromiseImpl.resolve();
        } else {
            return this.localStore.nextMutationBatch(this.lastBatchSeen).then(function (batch) {
                if (batch === null) {
                    return _promise.PromiseImpl.resolve();
                } else {
                    _this.commit(batch);
                    return _this.fillWritePipeline();
                }
            });
        }
    };
    /**
     * Returns true if the backend can accept additional write requests.
     *
     * When sending mutations to the write stream (e.g. in fillWritePipeline),
     * call this method first to check if more mutations can be sent.
     *
     * Currently the only thing that can prevent the backend from accepting
     * write requests is if there are too many requests already outstanding. As
     * writes complete the backend will be able to accept more.
     */
    RemoteStore.prototype.canWriteMutations = function () {
        return this.pendingWrites.length < MAX_PENDING_WRITES;
    };
    // For testing
    RemoteStore.prototype.outstandingWrites = function () {
        return this.pendingWrites.length;
    };
    /**
     * Given mutations to commit, actually commits them to the Datastore. Note
     * that this does *not* return a Promise specifically because the AsyncQueue
     * should not block operations for this.
     */
    RemoteStore.prototype.commit = function (batch) {
        (0, _assert.assert)(this.canWriteMutations(), "commit called when batches can't be written");
        this.lastBatchSeen = batch.batchId;
        this.pendingWrites.push(batch);
        if (!this.writeStream.isStarted()) {
            this.startWriteStream();
        } else if (this.writeStream.handshakeComplete) {
            this.writeStream.writeMutations(batch.mutations);
        }
    };
    RemoteStore.prototype.startWriteStream = function () {
        (0, _assert.assert)(!this.writeStream.isStarted(), "Can't restart started write stream");
        this.writeStream.start();
    };
    RemoteStore.prototype.onWriteStreamOpen = function () {
        this.writeStream.writeHandshake();
        return _promise.PromiseImpl.resolve();
    };
    RemoteStore.prototype.onWriteHandshakeComplete = function () {
        var _this = this;
        // Record the stream token.
        return this.localStore.setLastStreamToken(this.writeStream.lastStreamToken).then(function () {
            // Drain any pending writes.
            //
            // Note that at this point pendingWrites contains mutations that
            // have already been accepted by fillWritePipeline/commitBatch. If
            // the pipeline is full, canWriteMutations will be false, despite
            // the fact that we actually need to send mutations over.
            //
            // This also means that this method indirectly respects the limits
            // imposed by canWriteMutations since writes can't be added to the
            // pendingWrites array when canWriteMutations is false. If the
            // limits imposed by canWriteMutations actually protect us from
            // DOSing ourselves then those limits won't be exceeded here and
            // we'll continue to make progress.
            for (var _i = 0, _a = _this.pendingWrites; _i < _a.length; _i++) {
                var batch = _a[_i];
                _this.writeStream.writeMutations(batch.mutations);
            }
        });
    };
    RemoteStore.prototype.onMutationResult = function (commitVersion, results) {
        var _this = this;
        // This is a response to a write containing mutations and should be
        // correlated to the first pending write.
        (0, _assert.assert)(this.pendingWrites.length > 0, 'Got result for empty pending writes');
        var batch = this.pendingWrites.shift();
        var success = _mutation_batch.MutationBatchResult.from(batch, commitVersion, results, this.writeStream.lastStreamToken);
        return this.syncEngine.applySuccessfulWrite(success).then(function () {
            // It's possible that with the completion of this mutation another
            // slot has freed up.
            return _this.fillWritePipeline();
        });
    };
    RemoteStore.prototype.onWriteStreamClose = function (error) {
        var _this = this;
        // Ignore close if there are no pending writes.
        if (this.pendingWrites.length > 0) {
            (0, _assert.assert)(!!error, 'We have pending writes, but the write stream closed without an error');
            // A promise that is resolved after we processed the error
            var errorHandling = void 0;
            if (this.writeStream.handshakeComplete) {
                // This error affects the actual write.
                errorHandling = this.handleWriteError(error);
            } else {
                // If there was an error before the handshake has finished, it's
                // possible that the server is unable to process the stream token
                // we're sending. (Perhaps it's too old?)
                errorHandling = this.handleHandshakeError(error);
            }
            return errorHandling.then(function () {
                // The write stream might have been started by refilling the write
                // pipeline for failed writes
                if (_this.pendingWrites.length > 0 && !_this.writeStream.isStarted()) {
                    _this.startWriteStream();
                }
            });
        } else {
            // No pending writes, nothing to do
            return _promise.PromiseImpl.resolve();
        }
    };
    RemoteStore.prototype.handleHandshakeError = function (error) {
        // Reset the token if it's a permanent error or the error code is
        // ABORTED, signaling the write stream is no longer valid.
        if ((0, _rpc_error.isPermanentError)(error.code) || error.code === _error.Code.ABORTED) {
            log.debug(LOG_TAG, 'RemoteStore error before completed handshake; resetting stream token: ', this.writeStream.lastStreamToken);
            this.writeStream.lastStreamToken = (0, _platform.emptyByteString)();
            return this.localStore.setLastStreamToken((0, _platform.emptyByteString)());
        } else {
            // Some other error, don't reset stream token. Our stream logic will
            // just retry with exponential backoff.
            return _promise.PromiseImpl.resolve();
        }
    };
    RemoteStore.prototype.handleWriteError = function (error) {
        var _this = this;
        if ((0, _rpc_error.isPermanentError)(error.code)) {
            // This was a permanent error, the request itself was the problem
            // so it's not going to succeed if we resend it.
            var batch = this.pendingWrites.shift();
            // In this case it's also unlikely that the server itself is melting
            // down -- this was just a bad request so inhibit backoff on the next
            // restart.
            this.writeStream.inhibitBackoff();
            return this.syncEngine.rejectFailedWrite(batch.batchId, error).then(function () {
                // It's possible that with the completion of this mutation
                // another slot has freed up.
                return _this.fillWritePipeline();
            });
        } else {
            // Transient error, just let the retry logic kick in.
            return _promise.PromiseImpl.resolve();
        }
    };
    RemoteStore.prototype.createTransaction = function () {
        return new _transaction.Transaction(this.datastore);
    };
    RemoteStore.prototype.handleUserChange = function (user) {
        var _this = this;
        log.debug(LOG_TAG, 'RemoteStore changing users: uid=', user.uid);
        // Clear pending writes because those are per-user. Watched targets
        // persist across users so don't clear those.
        this.lastBatchSeen = _mutation_batch.BATCHID_UNKNOWN;
        this.pendingWrites = [];
        // Stop the streams. They promise not to call us back.
        this.watchStream.stop();
        this.writeStream.stop();
        this.cleanupWatchStreamState();
        // Create new streams (but note they're not started yet).
        return this.setupStreams().then(function () {
            // If there are any watchedTargets, properly handle the stream
            // restart now that RemoteStore is ready to handle them.
            if (_this.shouldStartWatchStream()) {
                _this.startWatchStream();
            }
            // Resume any writes
            return _this.fillWritePipeline();
        }).then(function () {
            // User change moves us back to the unknown state because we might
            // not want to re-open the stream
            _this.setOnlineStateToUnknown();
        });
    };
    return RemoteStore;
}();
exports.RemoteStore = RemoteStore;
//# sourceMappingURL=remote_store.js.map
