/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MemoryPersistence = undefined;

var _assert = require('../util/assert');

var _log = require('../util/log');

var _promise = require('../../utils/promise');

var _memory_mutation_queue = require('./memory_mutation_queue');

var _memory_query_cache = require('./memory_query_cache');

var _memory_remote_document_cache = require('./memory_remote_document_cache');

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
var LOG_TAG = 'MemoryPersistence';
/**
 * A memory-backed instance of Persistence. Data is stored only in RAM and
 * not persisted across sessions.
 */
var MemoryPersistence = /** @class */function () {
    function MemoryPersistence() {
        /**
         * Note that these are retained here to make it easier to write tests
         * affecting both the in-memory and IndexedDB-backed persistence layers. Tests
         * can create a new LocalStore wrapping this Persistence instance and this
         * will make the in-memory persistence layer behave as if it were actually
         * persisting values.
         */
        this.mutationQueues = {};
        this.remoteDocumentCache = new _memory_remote_document_cache.MemoryRemoteDocumentCache();
        this.queryCache = new _memory_query_cache.MemoryQueryCache();
        this.started = false;
    }
    MemoryPersistence.prototype.start = function () {
        (0, _assert.assert)(!this.started, 'MemoryPersistence double-started!');
        this.started = true;
        // No durable state to read on startup.
        return _promise.PromiseImpl.resolve();
    };
    MemoryPersistence.prototype.shutdown = function () {
        // No durable state to ensure is closed on shutdown.
        (0, _assert.assert)(this.started, 'MemoryPersistence shutdown without start!');
        this.started = false;
        return _promise.PromiseImpl.resolve();
    };
    MemoryPersistence.prototype.getMutationQueue = function (user) {
        var queue = this.mutationQueues[user.toKey()];
        if (!queue) {
            queue = new _memory_mutation_queue.MemoryMutationQueue();
            this.mutationQueues[user.toKey()] = queue;
        }
        return queue;
    };
    MemoryPersistence.prototype.getQueryCache = function () {
        return this.queryCache;
    };
    MemoryPersistence.prototype.getRemoteDocumentCache = function () {
        return this.remoteDocumentCache;
    };
    MemoryPersistence.prototype.runTransaction = function (action, operation) {
        (0, _log.debug)(LOG_TAG, 'Starting transaction:', action);
        return operation(new MemoryPersistenceTransaction()).toPromise();
    };
    return MemoryPersistence;
}();
exports.MemoryPersistence = MemoryPersistence;
/** Dummy class since memory persistence doesn't actually use transactions. */

var MemoryPersistenceTransaction = /** @class */function () {
    function MemoryPersistenceTransaction() {}
    return MemoryPersistenceTransaction;
}();
//# sourceMappingURL=memory_persistence.js.map
