/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MemoryQueryCache = undefined;

var _snapshot_version = require('../core/snapshot_version');

var _obj_map = require('../util/obj_map');

var _persistence_promise = require('./persistence_promise');

var _reference_set = require('./reference_set');

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
var MemoryQueryCache = /** @class */function () {
    function MemoryQueryCache() {
        /**
         * Maps a query to the data about that query
         */
        this.queries = new _obj_map.ObjectMap(function (q) {
            return q.canonicalId();
        });
        /** The last received snapshot version. */
        this.lastRemoteSnapshotVersion = _snapshot_version.SnapshotVersion.MIN;
        /** The highest numbered target ID encountered. */
        this.highestTargetId = 0;
        /**
         * A ordered bidirectional mapping between documents and the remote target
         * IDs.
         */
        this.references = new _reference_set.ReferenceSet();
    }
    MemoryQueryCache.prototype.start = function (transaction) {
        // Nothing to do.
        return _persistence_promise.PersistencePromise.resolve();
    };
    MemoryQueryCache.prototype.getLastRemoteSnapshotVersion = function () {
        return this.lastRemoteSnapshotVersion;
    };
    MemoryQueryCache.prototype.getHighestTargetId = function () {
        return this.highestTargetId;
    };
    MemoryQueryCache.prototype.setLastRemoteSnapshotVersion = function (transaction, snapshotVersion) {
        this.lastRemoteSnapshotVersion = snapshotVersion;
        return _persistence_promise.PersistencePromise.resolve();
    };
    MemoryQueryCache.prototype.addQueryData = function (transaction, queryData) {
        this.queries.set(queryData.query, queryData);
        var targetId = queryData.targetId;
        if (targetId > this.highestTargetId) {
            this.highestTargetId = targetId;
        }
        return _persistence_promise.PersistencePromise.resolve();
    };
    MemoryQueryCache.prototype.removeQueryData = function (transaction, queryData) {
        this.queries.delete(queryData.query);
        this.references.removeReferencesForId(queryData.targetId);
        return _persistence_promise.PersistencePromise.resolve();
    };
    MemoryQueryCache.prototype.getQueryData = function (transaction, query) {
        var queryData = this.queries.get(query) || null;
        return _persistence_promise.PersistencePromise.resolve(queryData);
    };
    MemoryQueryCache.prototype.addMatchingKeys = function (txn, keys, targetId) {
        this.references.addReferences(keys, targetId);
        return _persistence_promise.PersistencePromise.resolve();
    };
    MemoryQueryCache.prototype.removeMatchingKeys = function (txn, keys, targetId) {
        this.references.removeReferences(keys, targetId);
        return _persistence_promise.PersistencePromise.resolve();
    };
    MemoryQueryCache.prototype.removeMatchingKeysForTargetId = function (txn, targetId) {
        this.references.removeReferencesForId(targetId);
        return _persistence_promise.PersistencePromise.resolve();
    };
    MemoryQueryCache.prototype.getMatchingKeysForTargetId = function (txn, targetId) {
        var matchingKeys = this.references.referencesForId(targetId);
        return _persistence_promise.PersistencePromise.resolve(matchingKeys);
    };
    MemoryQueryCache.prototype.setGarbageCollector = function (gc) {
        this.references.setGarbageCollector(gc);
    };
    MemoryQueryCache.prototype.containsKey = function (txn, key) {
        return this.references.containsKey(txn, key);
    };
    return MemoryQueryCache;
}();
exports.MemoryQueryCache = MemoryQueryCache;
//# sourceMappingURL=memory_query_cache.js.map
