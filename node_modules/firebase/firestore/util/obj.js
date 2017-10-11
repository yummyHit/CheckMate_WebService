/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
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


exports.contains = contains;
exports.get = get;
exports.size = size;
exports.defaulted = defaulted;
exports.forEachNumber = forEachNumber;
exports.forEach = forEach;
exports.lookupOrInsert = lookupOrInsert;
exports.isEmpty = isEmpty;
exports.shallowCopy = shallowCopy;

var _assert = require('./assert');

function contains(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function get(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : null;
}
function size(obj) {
    var count = 0;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            count++;
        }
    }
    return count;
}
/** Returns the given value if it's defined or the defaultValue otherwise. */
function defaulted(value, defaultValue) {
    return value !== undefined ? value : defaultValue;
}
function forEachNumber(obj, fn) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var num = parseInt(key, 10);
            if (!isNaN(num)) {
                fn(num, obj[key]);
            }
        }
    }
}
function forEach(obj, fn) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn(key, obj[key]);
        }
    }
}
function lookupOrInsert(obj, key, valFn) {
    if (!contains(obj, key)) {
        obj[key] = valFn();
    }
    return obj[key];
}
function isEmpty(obj) {
    (0, _assert.assert)(obj != null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object', 'isEmpty() expects object parameter.');
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
function shallowCopy(obj) {
    (0, _assert.assert)(obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object', 'shallowCopy() expects object parameter.');
    var result = {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = obj[key];
        }
    }
    return result;
}
//# sourceMappingURL=obj.js.map
