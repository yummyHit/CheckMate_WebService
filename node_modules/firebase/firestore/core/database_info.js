/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/

---

typedarray.js
Copyright (c) 2010, Linden Research, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DatabaseId = exports.DatabaseInfo = undefined;

var _misc = require('../util/misc');

var DatabaseInfo = /** @class */function () {
    /**
     * Constructs a DatabaseInfo using the provided host, databaseId and
     * persistenceKey.
     *
     * @param databaseId The database to use.
     * @param persistenceKey A unique identifier for this Firestore's local
     * storage (used in conjunction with the databaseId).
     * @param host The Firestore backend host to connect to.
     * @param ssl Whether to use SSL when connecting.
     */
    function DatabaseInfo(databaseId, persistenceKey, host, ssl) {
        this.databaseId = databaseId;
        this.persistenceKey = persistenceKey;
        this.host = host;
        this.ssl = ssl;
    }
    return DatabaseInfo;
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
exports.DatabaseInfo = DatabaseInfo;
/** The default database name for a project. */

var DEFAULT_DATABASE_NAME = '(default)';
/** Represents the database ID a Firestore client is associated with. */
var DatabaseId = /** @class */function () {
    function DatabaseId(projectId, database) {
        this.projectId = projectId;
        this.database = database ? database : DEFAULT_DATABASE_NAME;
    }
    Object.defineProperty(DatabaseId.prototype, "isDefaultDatabase", {
        get: function get() {
            return this.database === DEFAULT_DATABASE_NAME;
        },
        enumerable: true,
        configurable: true
    });
    DatabaseId.prototype.equals = function (other) {
        return other instanceof DatabaseId && other.projectId === this.projectId && other.database === this.database;
    };
    DatabaseId.prototype.compareTo = function (other) {
        return (0, _misc.primitiveComparator)(this.projectId, other.projectId) || (0, _misc.primitiveComparator)(this.database, other.database);
    };
    return DatabaseId;
}();
exports.DatabaseId = DatabaseId;
//# sourceMappingURL=database_info.js.map
