/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IndexedDbQueryCache = undefined;

var _snapshot_version = require('../core/snapshot_version');

var _timestamp = require('../core/timestamp');

var _collections = require('../model/collections');

var _document_key = require('../model/document_key');

var _assert = require('../util/assert');

var _misc = require('../util/misc');

var _encoded_resource_path = require('./encoded_resource_path');

var EncodedResourcePath = _interopRequireWildcard(_encoded_resource_path);

var _indexeddb_schema = require('./indexeddb_schema');

var _persistence_promise = require('./persistence_promise');

var _simple_db = require('./simple_db');

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
var IndexedDbQueryCache = /** @class */function () {
    function IndexedDbQueryCache(serializer) {
        this.serializer = serializer;
        /**
         * The last received snapshot version. We store this seperately from the
         * metadata to avoid the extra conversion to/from DbTimestamp.
         */
        this.lastRemoteSnapshotVersion = _snapshot_version.SnapshotVersion.MIN;
        /**
         * A cached copy of the metadata for the query cache.
         */
        this.metadata = new _indexeddb_schema.DbTargetGlobal(
        /*highestTargetId=*/0,
        /*lastListenSequenceNumber=*/0, _snapshot_version.SnapshotVersion.MIN.toTimestamp());
        /** The garbage collector to notify about potential garbage keys. */
        this.garbageCollector = null;
    }
    IndexedDbQueryCache.prototype.start = function (transaction) {
        var _this = this;
        return globalTargetStore(transaction).get(_indexeddb_schema.DbTargetGlobal.key).next(function (metadata) {
            if (metadata !== null) {
                _this.metadata = metadata;
                var lastSavedVersion = metadata.lastRemoteSnapshotVersion;
                _this.lastRemoteSnapshotVersion = _snapshot_version.SnapshotVersion.fromTimestamp(new _timestamp.Timestamp(lastSavedVersion.seconds, lastSavedVersion.nanos));
            }
            return _persistence_promise.PersistencePromise.resolve();
        });
    };
    IndexedDbQueryCache.prototype.getHighestTargetId = function () {
        return this.metadata.highestTargetId;
    };
    IndexedDbQueryCache.prototype.getLastRemoteSnapshotVersion = function () {
        return this.lastRemoteSnapshotVersion;
    };
    IndexedDbQueryCache.prototype.setLastRemoteSnapshotVersion = function (transaction, snapshotVersion) {
        this.lastRemoteSnapshotVersion = snapshotVersion;
        this.metadata.lastRemoteSnapshotVersion = snapshotVersion.toTimestamp();
        return globalTargetStore(transaction).put(_indexeddb_schema.DbTargetGlobal.key, this.metadata);
    };
    IndexedDbQueryCache.prototype.addQueryData = function (transaction, queryData) {
        var _this = this;
        var targetId = queryData.targetId;
        var addedQueryPromise = targetsStore(transaction).put(this.serializer.toDbTarget(queryData));
        if (targetId > this.metadata.highestTargetId) {
            this.metadata.highestTargetId = targetId;
            return addedQueryPromise.next(function () {
                return globalTargetStore(transaction).put(_indexeddb_schema.DbTargetGlobal.key, _this.metadata);
            });
        } else {
            return addedQueryPromise;
        }
    };
    IndexedDbQueryCache.prototype.removeQueryData = function (transaction, queryData) {
        return this.removeMatchingKeysForTargetId(transaction, queryData.targetId).next(function () {
            targetsStore(transaction).delete(queryData.targetId);
        });
    };
    IndexedDbQueryCache.prototype.getQueryData = function (transaction, query) {
        var _this = this;
        // Iterating by the canonicalId may yield more than one result because
        // canonicalId values are not required to be unique per target. This query
        // depends on the queryTargets index to be efficent.
        var canonicalId = query.canonicalId();
        var range = IDBKeyRange.bound([canonicalId, Number.NEGATIVE_INFINITY], [canonicalId, Number.POSITIVE_INFINITY]);
        var result = null;
        return targetsStore(transaction).iterate({ range: range, index: _indexeddb_schema.DbTarget.queryTargetsIndexName }, function (key, value, control) {
            var found = _this.serializer.fromDbTarget(value);
            // After finding a potential match, check that the query is
            // actually equal to the requested query.
            if (query.equals(found.query)) {
                result = found;
                control.done();
            }
        }).next(function () {
            return result;
        });
    };
    IndexedDbQueryCache.prototype.addMatchingKeys = function (txn, keys, targetId) {
        // PORTING NOTE: The reverse index (documentsTargets) is maintained by
        // Indexeddb.
        var promises = [];
        var store = documentTargetStore(txn);
        keys.forEach(function (key) {
            var path = EncodedResourcePath.encode(key.path);
            promises.push(store.put(new _indexeddb_schema.DbTargetDocument(targetId, path)));
        });
        return _persistence_promise.PersistencePromise.waitFor(promises);
    };
    IndexedDbQueryCache.prototype.removeMatchingKeys = function (txn, keys, targetId) {
        var _this = this;
        // PORTING NOTE: The reverse index (documentsTargets) is maintained by
        // IndexedDb.
        var promises = [];
        var store = documentTargetStore(txn);
        keys.forEach(function (key) {
            var path = EncodedResourcePath.encode(key.path);
            promises.push(store.delete([targetId, path]));
            if (_this.garbageCollector !== null) {
                _this.garbageCollector.addPotentialGarbageKey(key);
            }
        });
        return _persistence_promise.PersistencePromise.waitFor(promises);
    };
    IndexedDbQueryCache.prototype.removeMatchingKeysForTargetId = function (txn, targetId) {
        var store = documentTargetStore(txn);
        var range = IDBKeyRange.bound([targetId], [targetId + 1],
        /*lowerOpen=*/false,
        /*upperOpen=*/true);
        return this.notifyGCForRemovedKeys(txn, range).next(function () {
            return store.delete(range);
        });
    };
    IndexedDbQueryCache.prototype.notifyGCForRemovedKeys = function (txn, range) {
        var _this = this;
        var store = documentTargetStore(txn);
        if (this.garbageCollector !== null && this.garbageCollector.isEager) {
            // In order to generate garbage events properly, we need to read these
            // keys before deleting.
            return store.iterate({ range: range, keysOnly: true }, function (key, _, control) {
                var path = EncodedResourcePath.decode(key[1]);
                var docKey = new _document_key.DocumentKey(path);
                // Paranoid assertion in case the the collector is set to null
                // during the iteration.
                (0, _assert.assert)(_this.garbageCollector !== null, 'GarbageCollector for query cache set to null during key removal.');
                _this.garbageCollector.addPotentialGarbageKey(docKey);
            });
        } else {
            return _persistence_promise.PersistencePromise.resolve();
        }
    };
    IndexedDbQueryCache.prototype.getMatchingKeysForTargetId = function (txn, targetId) {
        var promises = [];
        var range = IDBKeyRange.bound([targetId], [targetId + 1],
        /*lowerOpen=*/false,
        /*upperOpen=*/true);
        var store = documentTargetStore(txn);
        var result = (0, _collections.documentKeySet)();
        return store.iterate({ range: range, keysOnly: true }, function (key, _, control) {
            var path = EncodedResourcePath.decode(key[1]);
            var docKey = new _document_key.DocumentKey(path);
            result = result.add(docKey);
        }).next(function () {
            return result;
        });
    };
    IndexedDbQueryCache.prototype.setGarbageCollector = function (gc) {
        this.garbageCollector = gc;
    };
    IndexedDbQueryCache.prototype.containsKey = function (txn, key) {
        (0, _assert.assert)(txn !== null, 'Persistence Transaction cannot be null for query cache containsKey');
        var path = EncodedResourcePath.encode(key.path);
        var range = IDBKeyRange.bound([path], [(0, _misc.immediateSuccessor)(path)],
        /*lowerOpen=*/false,
        /*upperOpen=*/true);
        var count = 0;
        return documentTargetStore(txn).iterate({
            index: _indexeddb_schema.DbTargetDocument.documentTargetsIndex,
            keysOnly: true,
            range: range
        }, function (key, _, control) {
            count++;
            control.done();
        }).next(function () {
            return count > 0;
        });
    };
    return IndexedDbQueryCache;
}();
exports.IndexedDbQueryCache = IndexedDbQueryCache;
/**
 * Helper to get a typed SimpleDbStore for the queries object store.
 */

function targetsStore(txn) {
    return getStore(txn, _indexeddb_schema.DbTarget.store);
}
/**
 * Helper to get a typed SimpleDbStore for the target globals object store.
 */
function globalTargetStore(txn) {
    return getStore(txn, _indexeddb_schema.DbTargetGlobal.store);
}
/**
 * Helper to get a typed SimpleDbStore for the document target object store.
 */
function documentTargetStore(txn) {
    return getStore(txn, _indexeddb_schema.DbTargetDocument.store);
}
/**
 * Helper to get a typed SimpleDbStore from a transaction.
 */
function getStore(txn, store) {
    if (txn instanceof _simple_db.SimpleDbTransaction) {
        return txn.store(store);
    } else {
        return (0, _assert.fail)('Invalid transaction object provided!');
    }
}
//# sourceMappingURL=indexeddb_query_cache.js.map
