/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Timestamp = undefined;

var _assert = require('../util/assert');

var _misc = require('../util/misc');

// A RegExp matching ISO 8601 UTC timestamps with optional fraction.
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
var isoRegExp = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
var Timestamp = /** @class */function () {
    function Timestamp(seconds, nanos) {
        this.seconds = seconds;
        this.nanos = nanos;
        (0, _assert.assert)(nanos >= 0, 'timestamp nanoseconds out of range: ' + nanos);
        (0, _assert.assert)(nanos < 1e9, 'timestamp nanoseconds out of range' + nanos);
        // Midnight at the beginning of 1/1/1 is the earliest Firestore supports.
        (0, _assert.assert)(seconds >= -62135596800, 'timestamp seconds out of range: ' + seconds);
        // This will break in the year 10,000.
        (0, _assert.assert)(seconds < 253402300800, 'timestamp seconds out of range' + seconds);
    }
    Timestamp.now = function () {
        return Timestamp.fromEpochMilliseconds(Date.now());
    };
    Timestamp.fromDate = function (date) {
        return Timestamp.fromEpochMilliseconds(date.getTime());
    };
    Timestamp.fromEpochMilliseconds = function (milliseconds) {
        var seconds = Math.floor(milliseconds / 1000);
        var nanos = (milliseconds - seconds * 1000) * 1e6;
        return new Timestamp(seconds, nanos);
    };
    Timestamp.fromISOString = function (utc) {
        // The date string can have higher precision (nanos) than the Date class
        // (millis), so we do some custom parsing here.
        // Parse the nanos right out of the string.
        var nanos = 0;
        var fraction = isoRegExp.exec(utc);
        (0, _assert.assert)(!!fraction, 'invalid timestamp: ' + utc);
        if (fraction[1]) {
            // Pad the fraction out to 9 digits (nanos).
            var nanoStr = fraction[1];
            nanoStr = (nanoStr + '000000000').substr(0, 9);
            nanos = parseInt(nanoStr, 10);
        }
        // Parse the date to get the seconds.
        var date = new Date(utc);
        var seconds = Math.floor(date.getTime() / 1000);
        return new Timestamp(seconds, nanos);
    };
    Timestamp.prototype.toDate = function () {
        return new Date(this.toEpochMilliseconds());
    };
    Timestamp.prototype.toEpochMilliseconds = function () {
        return this.seconds * 1000 + this.nanos / 1e6;
    };
    Timestamp.prototype.compareTo = function (other) {
        if (this.seconds === other.seconds) {
            return (0, _misc.primitiveComparator)(this.nanos, other.nanos);
        }
        return (0, _misc.primitiveComparator)(this.seconds, other.seconds);
    };
    Timestamp.prototype.equals = function (other) {
        return other.seconds === this.seconds && other.nanos === this.nanos;
    };
    Timestamp.prototype.toString = function () {
        return 'Timestamp(seconds=' + this.seconds + ', nanos=' + this.nanos + ')';
    };
    return Timestamp;
}();
exports.Timestamp = Timestamp;
//# sourceMappingURL=timestamp.js.map
