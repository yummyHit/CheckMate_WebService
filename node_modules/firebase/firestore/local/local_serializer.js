/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LocalSerializer = undefined;

var _snapshot_version = require('../core/snapshot_version');

var _timestamp = require('../core/timestamp');

var _document = require('../model/document');

var _document_key = require('../model/document_key');

var _mutation_batch = require('../model/mutation_batch');

var _assert = require('../util/assert');

var _indexeddb_schema = require('./indexeddb_schema');

var _query_data = require('./query_data');

/** Serializer for values stored in the LocalStore. */
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
var LocalSerializer = /** @class */function () {
    function LocalSerializer(remoteSerializer) {
        this.remoteSerializer = remoteSerializer;
    }
    /** Decodes a remote document from storage locally to a Document. */
    LocalSerializer.prototype.fromDbRemoteDocument = function (remoteDoc) {
        if (remoteDoc.document) {
            return this.remoteSerializer.fromDocument(remoteDoc.document);
        } else if (remoteDoc.noDocument) {
            var key = _document_key.DocumentKey.fromSegments(remoteDoc.noDocument.path);
            var readTime = remoteDoc.noDocument.readTime;
            var timestamp = new _timestamp.Timestamp(readTime.seconds, readTime.nanos);
            return new _document.NoDocument(key, _snapshot_version.SnapshotVersion.fromTimestamp(timestamp));
        } else {
            return (0, _assert.fail)('Unexpected DbRemoteDocument');
        }
    };
    /** Encodes a document for storage locally. */
    LocalSerializer.prototype.toDbRemoteDocument = function (maybeDoc) {
        if (maybeDoc instanceof _document.Document) {
            var doc = this.remoteSerializer.toDocument(maybeDoc);
            return new _indexeddb_schema.DbRemoteDocument(null, doc);
        } else {
            var path = maybeDoc.key.path.toArray();
            var timestamp = maybeDoc.version.toTimestamp();
            var readTime = new _indexeddb_schema.DbTimestamp(timestamp.seconds, timestamp.nanos);
            return new _indexeddb_schema.DbRemoteDocument(new _indexeddb_schema.DbNoDocument(path, readTime), null);
        }
    };
    /** Encodes a batch of mutations into a DbMutationBatch for local storage. */
    LocalSerializer.prototype.toDbMutationBatch = function (userId, batch) {
        var _this = this;
        var serializedMutations = batch.mutations.map(function (m) {
            return _this.remoteSerializer.toMutation(m);
        });
        return new _indexeddb_schema.DbMutationBatch(userId, batch.batchId, batch.localWriteTime.toEpochMilliseconds(), serializedMutations);
    };
    /** Decodes a DbMutationBatch into a MutationBatch */
    LocalSerializer.prototype.fromDbMutationBatch = function (dbBatch) {
        var _this = this;
        var mutations = dbBatch.mutations.map(function (m) {
            return _this.remoteSerializer.fromMutation(m);
        });
        var timestamp = _timestamp.Timestamp.fromEpochMilliseconds(dbBatch.localWriteTimeMs);
        return new _mutation_batch.MutationBatch(dbBatch.batchId, timestamp, mutations);
    };
    /** Decodes a DbTarget into QueryData */
    LocalSerializer.prototype.fromDbTarget = function (dbTarget) {
        var readTime = new _timestamp.Timestamp(dbTarget.readTime.seconds, dbTarget.readTime.nanos);
        var version = _snapshot_version.SnapshotVersion.fromTimestamp(readTime);
        var query;
        if (isDocumentQuery(dbTarget.query)) {
            query = this.remoteSerializer.fromDocumentsTarget(dbTarget.query);
        } else {
            query = this.remoteSerializer.fromQueryTarget(dbTarget.query);
        }
        return new _query_data.QueryData(query, dbTarget.targetId, _query_data.QueryPurpose.Listen, version, dbTarget.resumeToken);
    };
    /** Encodes QueryData into a DbTarget for storage locally. */
    LocalSerializer.prototype.toDbTarget = function (queryData) {
        (0, _assert.assert)(_query_data.QueryPurpose.Listen === queryData.purpose, 'Only queries with purpose ' + _query_data.QueryPurpose.Listen + ' may be stored, got ' + queryData.purpose);
        var timestamp = queryData.snapshotVersion.toTimestamp();
        var dbTimestamp = new _indexeddb_schema.DbTimestamp(timestamp.seconds, timestamp.nanos);
        var queryProto;
        if (queryData.query.isDocumentQuery()) {
            queryProto = this.remoteSerializer.toDocumentsTarget(queryData.query);
        } else {
            queryProto = this.remoteSerializer.toQueryTarget(queryData.query);
        }
        (0, _assert.assert)(typeof queryData.resumeToken === 'string', 'Persisting non-string resume token not supported.');
        var resumeToken = queryData.resumeToken;
        // lastListenSequenceNumber is always 0 until we do real GC.
        return new _indexeddb_schema.DbTarget(queryData.targetId, queryData.query.canonicalId(), dbTimestamp, resumeToken, 0, queryProto);
    };
    return LocalSerializer;
}();
exports.LocalSerializer = LocalSerializer;
/**
 * A helper function for figuring out what kind of query has been stored.
 */

function isDocumentQuery(dbQuery) {
    return dbQuery.documents !== undefined;
}
//# sourceMappingURL=local_serializer.js.map
