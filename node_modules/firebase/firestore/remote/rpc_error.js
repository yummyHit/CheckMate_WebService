/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isPermanentError = isPermanentError;
exports.mapCodeFromRpcStatus = mapCodeFromRpcStatus;
exports.mapCodeFromRpcCode = mapCodeFromRpcCode;
exports.mapRpcCodeFromCode = mapRpcCodeFromCode;
exports.mapCodeFromHttpStatus = mapCodeFromHttpStatus;

var _assert = require('../util/assert');

var _error = require('../util/error');

/**
 * Error Codes describing the different ways GRPC can fail. These are copied
 * directly from GRPC's sources here:
 *
 * https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
 *
 * Important! The names of these identifiers matter because the string forms
 * are used for reverse lookups from the webchannel stream. Do NOT change the
 * names of these identifiers.
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
var RpcCode;
(function (RpcCode) {
    RpcCode[RpcCode["OK"] = 0] = "OK";
    RpcCode[RpcCode["CANCELLED"] = 1] = "CANCELLED";
    RpcCode[RpcCode["UNKNOWN"] = 2] = "UNKNOWN";
    RpcCode[RpcCode["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
    RpcCode[RpcCode["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
    RpcCode[RpcCode["NOT_FOUND"] = 5] = "NOT_FOUND";
    RpcCode[RpcCode["ALREADY_EXISTS"] = 6] = "ALREADY_EXISTS";
    RpcCode[RpcCode["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
    RpcCode[RpcCode["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
    RpcCode[RpcCode["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
    RpcCode[RpcCode["FAILED_PRECONDITION"] = 9] = "FAILED_PRECONDITION";
    RpcCode[RpcCode["ABORTED"] = 10] = "ABORTED";
    RpcCode[RpcCode["OUT_OF_RANGE"] = 11] = "OUT_OF_RANGE";
    RpcCode[RpcCode["UNIMPLEMENTED"] = 12] = "UNIMPLEMENTED";
    RpcCode[RpcCode["INTERNAL"] = 13] = "INTERNAL";
    RpcCode[RpcCode["UNAVAILABLE"] = 14] = "UNAVAILABLE";
    RpcCode[RpcCode["DATA_LOSS"] = 15] = "DATA_LOSS";
})(RpcCode || (RpcCode = {}));
function isPermanentError(code) {
    switch (code) {
        case _error.Code.OK:
            return (0, _assert.fail)('Treated status OK as error');
        case _error.Code.CANCELLED:
        case _error.Code.UNKNOWN:
        case _error.Code.DEADLINE_EXCEEDED:
        case _error.Code.RESOURCE_EXHAUSTED:
        case _error.Code.INTERNAL:
        case _error.Code.UNAVAILABLE:
        // Unauthenticated means something went wrong with our token and we need
        // to retry with new credentials which will happen automatically.
        // TODO(b/37325376): Give up after second unauthenticated error.
        case _error.Code.UNAUTHENTICATED:
            return false;
        case _error.Code.INVALID_ARGUMENT:
        case _error.Code.NOT_FOUND:
        case _error.Code.ALREADY_EXISTS:
        case _error.Code.PERMISSION_DENIED:
        case _error.Code.FAILED_PRECONDITION:
        // Aborted might be retried in some scenarios, but that is dependant on
        // the context and should handled individually by the calling code.
        // See https://cloud.google.com/apis/design/errors.
        case _error.Code.ABORTED:
        case _error.Code.OUT_OF_RANGE:
        case _error.Code.UNIMPLEMENTED:
        case _error.Code.DATA_LOSS:
            return true;
        default:
            return (0, _assert.fail)('Unknown status code: ' + code);
    }
}
/**
 * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
 *
 * @returns The Code equivalent to the given status string or undefined if
 *     there is no match.
 */
function mapCodeFromRpcStatus(status) {
    // tslint:disable-next-line:no-any lookup by string
    var code = RpcCode[status];
    if (code === undefined) {
        return undefined;
    }
    return mapCodeFromRpcCode(code);
}
/**
 * Maps an error Code from GRPC status code number, like 0, 1, or 14. These
 * are not the same as HTTP status codes.
 *
 * @returns The Code equivalent to the given GRPC status code. Fails if there
 *     is no match.
 */
function mapCodeFromRpcCode(code) {
    switch (code) {
        case RpcCode.OK:
            return _error.Code.OK;
        case RpcCode.CANCELLED:
            return _error.Code.CANCELLED;
        case RpcCode.UNKNOWN:
            return _error.Code.UNKNOWN;
        case RpcCode.DEADLINE_EXCEEDED:
            return _error.Code.DEADLINE_EXCEEDED;
        case RpcCode.RESOURCE_EXHAUSTED:
            return _error.Code.RESOURCE_EXHAUSTED;
        case RpcCode.INTERNAL:
            return _error.Code.INTERNAL;
        case RpcCode.UNAVAILABLE:
            return _error.Code.UNAVAILABLE;
        case RpcCode.UNAUTHENTICATED:
            return _error.Code.UNAUTHENTICATED;
        case RpcCode.INVALID_ARGUMENT:
            return _error.Code.INVALID_ARGUMENT;
        case RpcCode.NOT_FOUND:
            return _error.Code.NOT_FOUND;
        case RpcCode.ALREADY_EXISTS:
            return _error.Code.ALREADY_EXISTS;
        case RpcCode.PERMISSION_DENIED:
            return _error.Code.PERMISSION_DENIED;
        case RpcCode.FAILED_PRECONDITION:
            return _error.Code.FAILED_PRECONDITION;
        case RpcCode.ABORTED:
            return _error.Code.ABORTED;
        case RpcCode.OUT_OF_RANGE:
            return _error.Code.OUT_OF_RANGE;
        case RpcCode.UNIMPLEMENTED:
            return _error.Code.UNIMPLEMENTED;
        case RpcCode.DATA_LOSS:
            return _error.Code.DATA_LOSS;
        default:
            return (0, _assert.fail)('Unknown status code: ' + code);
    }
}
/**
 * Maps an RPC code from a Code. This is the reverse operation from
 * mapCodeFromRpcCode and should really only be used in tests.
 */
function mapRpcCodeFromCode(code) {
    if (code === undefined) {
        return RpcCode.OK;
    }
    switch (code) {
        case _error.Code.OK:
            return RpcCode.OK;
        case _error.Code.CANCELLED:
            return RpcCode.CANCELLED;
        case _error.Code.UNKNOWN:
            return RpcCode.UNKNOWN;
        case _error.Code.DEADLINE_EXCEEDED:
            return RpcCode.DEADLINE_EXCEEDED;
        case _error.Code.RESOURCE_EXHAUSTED:
            return RpcCode.RESOURCE_EXHAUSTED;
        case _error.Code.INTERNAL:
            return RpcCode.INTERNAL;
        case _error.Code.UNAVAILABLE:
            return RpcCode.UNAVAILABLE;
        case _error.Code.UNAUTHENTICATED:
            return RpcCode.UNAUTHENTICATED;
        case _error.Code.INVALID_ARGUMENT:
            return RpcCode.INVALID_ARGUMENT;
        case _error.Code.NOT_FOUND:
            return RpcCode.NOT_FOUND;
        case _error.Code.ALREADY_EXISTS:
            return RpcCode.ALREADY_EXISTS;
        case _error.Code.PERMISSION_DENIED:
            return RpcCode.PERMISSION_DENIED;
        case _error.Code.FAILED_PRECONDITION:
            return RpcCode.FAILED_PRECONDITION;
        case _error.Code.ABORTED:
            return RpcCode.ABORTED;
        case _error.Code.OUT_OF_RANGE:
            return RpcCode.OUT_OF_RANGE;
        case _error.Code.UNIMPLEMENTED:
            return RpcCode.UNIMPLEMENTED;
        case _error.Code.DATA_LOSS:
            return RpcCode.DATA_LOSS;
        default:
            return (0, _assert.fail)('Unknown status code: ' + code);
    }
}
/**
 * Converts an HTTP Status Code to the equivalent error code.
 *
 * @param status An HTTP Status Code, like 200, 404, 503, etc.
 * @returns The equivalent Code. Unknown status codes are mapped to
 *     Code.UNKNOWN.
 */
function mapCodeFromHttpStatus(status) {
    // The canonical error codes for Google APIs [1] specify mapping onto HTTP
    // status codes but the mapping is not bijective. In each case of ambiguity
    // this function chooses a primary error.
    //
    // [1]
    // https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    switch (status) {
        case 200:
            // OK
            return _error.Code.OK;
        case 400:
            // Bad Request
            return _error.Code.INVALID_ARGUMENT;
        // Other possibilities based on the forward mapping
        // return Code.FAILED_PRECONDITION;
        // return Code.OUT_OF_RANGE;
        case 401:
            // Unauthorized
            return _error.Code.UNAUTHENTICATED;
        case 403:
            // Forbidden
            return _error.Code.PERMISSION_DENIED;
        case 404:
            // Not Found
            return _error.Code.NOT_FOUND;
        case 409:
            // Conflict
            return _error.Code.ABORTED;
        // Other possibilities:
        // return Code.ALREADY_EXISTS;
        case 416:
            // Range Not Satisfiable
            return _error.Code.OUT_OF_RANGE;
        case 429:
            // Too Many Requests
            return _error.Code.RESOURCE_EXHAUSTED;
        case 499:
            // Client Closed Request
            return _error.Code.CANCELLED;
        case 500:
            // Internal Server Error
            return _error.Code.UNKNOWN;
        // Other possibilities:
        // return Code.INTERNAL;
        // return Code.DATA_LOSS;
        case 501:
            // Unimplemented
            return _error.Code.UNIMPLEMENTED;
        case 503:
            // Service Unavailable
            return _error.Code.UNAVAILABLE;
        case 504:
            // Gateway Timeout
            return _error.Code.DEADLINE_EXCEEDED;
        default:
            if (status >= 200 && status < 300) return _error.Code.OK;
            if (status >= 400 && status < 500) return _error.Code.FAILED_PRECONDITION;
            if (status >= 500 && status < 600) return _error.Code.INTERNAL;
            return _error.Code.UNKNOWN;
    }
}
//# sourceMappingURL=rpc_error.js.map
