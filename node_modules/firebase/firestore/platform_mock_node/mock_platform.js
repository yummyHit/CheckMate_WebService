/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MockPlatform = undefined;

var _serializer = require('../remote/serializer');

var _assert = require('../util/assert');

var _error = require('../util/error');

var MockPlatform = /** @class */function () {
    function MockPlatform() {
        /** A "mock" platform for use in NodeJS unit tests since we can't depend on
         * gRPC. */
        this.base64Available = true;
        this.emptyByteString = new Uint8Array(0);
    }
    MockPlatform.prototype.loadConnection = function (databaseInfo) {
        return (0, _assert.fail)('loadConnection() not supported in unit tests.');
    };
    MockPlatform.prototype.newSerializer = function (databaseId) {
        return new _serializer.JsonProtoSerializer(databaseId, { useProto3Json: false });
    };
    MockPlatform.prototype.atob = function (encoded) {
        // Node actually doesn't validate base64 strings.
        // A quick sanity check that is not a fool-proof validation
        if (/[^-A-Za-z0-9+/=]/.test(encoded)) {
            throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, 'Not a valid Base64 string: ' + encoded);
        }
        return new Buffer(encoded, 'base64').toString('binary');
    };
    MockPlatform.prototype.btoa = function (raw) {
        return new Buffer(raw, 'binary').toString('base64');
    };
    return MockPlatform;
}(); /**
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
exports.MockPlatform = MockPlatform;
//# sourceMappingURL=mock_platform.js.map
