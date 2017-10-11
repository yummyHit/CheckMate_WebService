/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlatformSupport = undefined;
exports.emptyByteString = emptyByteString;

var _assert = require('../util/assert');

/**
 * Provides singleton helpers where setup code can inject a platform at runtime.
 * setPlatform needs to be set before Firestore is used and must be set exactly
 * once.
 */
var PlatformSupport = /** @class */function () {
    function PlatformSupport() {}
    PlatformSupport.setPlatform = function (platform) {
        if (PlatformSupport.platform) {
            (0, _assert.fail)('Platform already defined');
        }
        PlatformSupport.platform = platform;
    };
    PlatformSupport.getPlatform = function () {
        if (!PlatformSupport.platform) {
            (0, _assert.fail)('Platform not set');
        }
        return PlatformSupport.platform;
    };
    return PlatformSupport;
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
exports.PlatformSupport = PlatformSupport;
/**
 * Returns the representation of an empty "proto" byte string for the
 * platform.
 */

function emptyByteString() {
    return PlatformSupport.getPlatform().emptyByteString;
}
//# sourceMappingURL=platform.js.map
