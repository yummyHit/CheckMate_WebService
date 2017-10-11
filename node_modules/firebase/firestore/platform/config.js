/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureForFirebase = configureForFirebase;
exports.configureForStandalone = configureForStandalone;

var _blob = require('../api/blob');

var _database = require('../api/database');

var _field_path = require('../api/field_path');

var _field_value = require('../api/field_value');

var _geo_point = require('../api/geo_point');

var _obj = require('../util/obj');

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
var firestoreNamespace = {
  Firestore: _database.PublicFirestore,
  GeoPoint: _geo_point.GeoPoint,
  Blob: _blob.PublicBlob,
  Transaction: _database.PublicTransaction,
  WriteBatch: _database.PublicWriteBatch,
  DocumentReference: _database.PublicDocumentReference,
  DocumentSnapshot: _database.PublicDocumentSnapshot,
  Query: _database.PublicQuery,
  QuerySnapshot: _database.PublicQuerySnapshot,
  CollectionReference: _database.PublicCollectionReference,
  FieldPath: _field_path.FieldPath,
  FieldValue: _field_value.PublicFieldValue,
  setLogLevel: _database.Firestore.setLogLevel
};
/**
 * Configures Firestore as part of the Firebase SDK by calling registerService.
 */
function configureForFirebase(firebase) {
  firebase.INTERNAL.registerService('firestore', function (app) {
    return new _database.Firestore(app);
  }, (0, _obj.shallowCopy)(firestoreNamespace));
}
/**
 * Exports the Firestore namespace into the provided `exportObject` object under
 * the key 'firestore'. This is used for wrapped binary that exposes Firestore
 * as a goog module.
 */
function configureForStandalone(exportObject) {
  var copiedNamespace = (0, _obj.shallowCopy)(firestoreNamespace);
  // Unlike the use with Firebase, the standalone allows the use of the
  // constructor, so export it's internal class
  copiedNamespace['Firestore'] = _database.Firestore;
  exportObject['firestore'] = copiedNamespace;
}
//# sourceMappingURL=config.js.map
