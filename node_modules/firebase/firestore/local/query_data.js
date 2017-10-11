/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryData = exports.QueryPurpose = undefined;

var _snapshot_version = require('../core/snapshot_version');

var _platform = require('../platform/platform');

/** An enumeration of the different purposes we have for queries. */
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
var QueryPurpose = exports.QueryPurpose = undefined;
(function (QueryPurpose) {
  /** A regular, normal query. */
  QueryPurpose[QueryPurpose["Listen"] = 0] = "Listen";
  /**
   * The query was used to refill a query after an existence filter mismatch.
   */
  QueryPurpose[QueryPurpose["ExistenceFilterMismatch"] = 1] = "ExistenceFilterMismatch";
  /** The query was used to resolve a limbo document. */
  QueryPurpose[QueryPurpose["LimboResolution"] = 2] = "LimboResolution";
})(QueryPurpose || (exports.QueryPurpose = QueryPurpose = {}));
/**
 * An immutable set of metadata that the local store tracks for each query.
 */
var QueryData = /** @class */function () {
  function QueryData(
  /** The query being listened to. */
  query,
  /**
   * The target ID to which the query corresponds; Assigned by the
   * LocalStore for user listens and by the SyncEngine for limbo watches.
   */
  targetId,
  /** The purpose of the query. */
  purpose,
  /** The latest snapshot version seen for this target. */
  snapshotVersion,
  /**
   * An opaque, server-assigned token that allows watching a query to be
   * resumed after disconnecting without retransmitting all the data that
   * matches the query. The resume token essentially identifies a point in
   * time from which the server should resume sending results.
   */
  resumeToken) {
    if (snapshotVersion === void 0) {
      snapshotVersion = _snapshot_version.SnapshotVersion.MIN;
    }
    if (resumeToken === void 0) {
      resumeToken = (0, _platform.emptyByteString)();
    }
    this.query = query;
    this.targetId = targetId;
    this.purpose = purpose;
    this.snapshotVersion = snapshotVersion;
    this.resumeToken = resumeToken;
  }
  /**
   * Creates a new query data instance with an updated snapshot version and
   * resume token.
   */
  QueryData.prototype.update = function (updated) {
    return new QueryData(this.query, this.targetId, this.purpose, updated.snapshotVersion, updated.resumeToken);
  };
  QueryData.prototype.equals = function (other) {
    return this.targetId === other.targetId && this.purpose === other.purpose && this.snapshotVersion.equals(other.snapshotVersion) && this.resumeToken === other.resumeToken && this.query.equals(other.query);
  };
  return QueryData;
}();
exports.QueryData = QueryData;
//# sourceMappingURL=query_data.js.map
