/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LocalViewChanges = undefined;

var _view_snapshot = require('../core/view_snapshot');

var _collections = require('../model/collections');

/**
 * A set of changes to what documents are currently in view and out of view for
 * a given query. These changes are sent to the LocalStore by the View (via
 * the SyncEngine) and are used to pin / unpin documents as appropriate.
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
var LocalViewChanges = /** @class */function () {
    function LocalViewChanges(query, addedKeys, removedKeys) {
        this.query = query;
        this.addedKeys = addedKeys;
        this.removedKeys = removedKeys;
    }
    LocalViewChanges.fromSnapshot = function (viewSnapshot) {
        var addedKeys = (0, _collections.documentKeySet)();
        var removedKeys = (0, _collections.documentKeySet)();
        for (var _i = 0, _a = viewSnapshot.docChanges; _i < _a.length; _i++) {
            var docChange = _a[_i];
            switch (docChange.type) {
                case _view_snapshot.ChangeType.Added:
                    addedKeys = addedKeys.add(docChange.doc.key);
                    break;
                case _view_snapshot.ChangeType.Removed:
                    removedKeys = removedKeys.add(docChange.doc.key);
                    break;
                default:
            }
        }
        return new LocalViewChanges(viewSnapshot.query, addedKeys, removedKeys);
    };
    return LocalViewChanges;
}();
exports.LocalViewChanges = LocalViewChanges;
//# sourceMappingURL=local_view_changes.js.map
