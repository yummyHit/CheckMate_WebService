/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NoOpGarbageCollector = undefined;

var _collections = require('../model/collections');

var _persistence_promise = require('./persistence_promise');

/**
 * A garbage collector implementation that does absolutely nothing. It ignores
 * all addGarbageSource and addPotentialGarbageKey messages and and never
 * produces any garbage.
 */
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
var NoOpGarbageCollector = /** @class */function () {
    function NoOpGarbageCollector() {
        this.isEager = false;
    }
    NoOpGarbageCollector.prototype.addGarbageSource = function (garbageSource) {
        // Not tracking garbage so don't track sources.
    };
    NoOpGarbageCollector.prototype.removeGarbageSource = function (garbageSource) {
        // Not tracking garbage so don't track sources.
    };
    NoOpGarbageCollector.prototype.addPotentialGarbageKey = function (key) {
        // Not tracking garbage so ignore.
    };
    NoOpGarbageCollector.prototype.collectGarbage = function (txn) {
        return _persistence_promise.PersistencePromise.resolve((0, _collections.documentKeySet)());
    };
    return NoOpGarbageCollector;
}();
exports.NoOpGarbageCollector = NoOpGarbageCollector;
//# sourceMappingURL=no_op_garbage_collector.js.map
