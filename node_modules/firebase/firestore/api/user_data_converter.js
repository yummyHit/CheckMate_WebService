/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserDataConverter = exports.DocumentKeyReference = exports.ParsedUpdateData = exports.ParsedSetData = undefined;

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


exports.fieldPathFromArgument = fieldPathFromArgument;

var _timestamp = require('../core/timestamp');

var _field_value = require('../model/field_value');

var _mutation = require('../model/mutation');

var _path = require('../model/path');

var _assert = require('../util/assert');

var _error = require('../util/error');

var _input_validation = require('../util/input_validation');

var _misc = require('../util/misc');

var _obj = require('../util/obj');

var objUtils = _interopRequireWildcard(_obj);

var _sorted_map = require('../util/sorted_map');

var _types = require('../util/types');

var typeUtils = _interopRequireWildcard(_types);

var _blob = require('./blob');

var _field_path = require('./field_path');

var _field_value2 = require('./field_value');

var _geo_point = require('./geo_point');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var RESERVED_FIELD_REGEX = /^__.*__$/;
/** The result of parsing document data (e.g. for a setData call). */
var ParsedSetData = /** @class */function () {
    function ParsedSetData(data, fieldMask, fieldTransforms) {
        this.data = data;
        this.fieldMask = fieldMask;
        this.fieldTransforms = fieldTransforms;
    }
    ParsedSetData.prototype.toMutations = function (key, precondition) {
        var mutations = [];
        if (this.fieldMask !== null) {
            mutations.push(new _mutation.PatchMutation(key, this.data, this.fieldMask, precondition));
        } else {
            mutations.push(new _mutation.SetMutation(key, this.data, precondition));
        }
        if (this.fieldTransforms.length > 0) {
            mutations.push(new _mutation.TransformMutation(key, this.fieldTransforms));
        }
        return mutations;
    };
    return ParsedSetData;
}();
exports.ParsedSetData = ParsedSetData;
/** The result of parsing "update" data (i.e. for an updateData call). */

var ParsedUpdateData = /** @class */function () {
    function ParsedUpdateData(data, fieldMask, fieldTransforms) {
        this.data = data;
        this.fieldMask = fieldMask;
        this.fieldTransforms = fieldTransforms;
    }
    ParsedUpdateData.prototype.toMutations = function (key, precondition) {
        var mutations = [new _mutation.PatchMutation(key, this.data, this.fieldMask, precondition)];
        if (this.fieldTransforms.length > 0) {
            mutations.push(new _mutation.TransformMutation(key, this.fieldTransforms));
        }
        return mutations;
    };
    return ParsedUpdateData;
}();
exports.ParsedUpdateData = ParsedUpdateData;
/*
 * Represents what type of API method provided the data being parsed; useful
 * for determining which error conditions apply during parsing and providing
 * better error messages.
 */

var UserDataSource;
(function (UserDataSource) {
    UserDataSource[UserDataSource["Set"] = 0] = "Set";
    UserDataSource[UserDataSource["Update"] = 1] = "Update";
    UserDataSource[UserDataSource["QueryValue"] = 2] = "QueryValue"; // from a where clause or cursor bound
})(UserDataSource || (UserDataSource = {}));
/** A "context" object passed around while parsing user data. */
var ParseContext = /** @class */function () {
    /**
     * Initializes a ParseContext with the given source and path.
     *
     * @param dataSource Indicates what kind of API method this data came from.
     * @param path A path within the object being parsed. This could be an empty
     * path (in which case the context represents the root of the data being
     * parsed), or a nonempty path (indicating the context represents a nested
     * location within the data).
     *
     * TODO(b/34871131): We don't support array paths right now, so path can be
     * null to indicate the context represents any location within an array (in
     * which case certain features will not work and errors will be somewhat
     * compromised).
     * @param fieldTransforms A mutable list of field transforms encountered while
     * parsing the data.
     * @param fieldMask A mutable list of field paths encountered while parsing
     * the data.
     */
    function ParseContext(dataSource, methodName, path, fieldTransforms, fieldMask) {
        this.dataSource = dataSource;
        this.methodName = methodName;
        this.path = path;
        // Minor hack: If fieldTransforms is undefined, we assume this is an
        // external call and we need to validate the entire path.
        if (fieldTransforms === undefined) {
            this.validatePath();
        }
        this.fieldTransforms = fieldTransforms || [];
        this.fieldMask = fieldMask || [];
    }
    ParseContext.prototype.childContext = function (field) {
        var childPath;
        if (typeof field === 'number') {
            // TODO(b/34871131): We don't support array paths right now; so make path
            // null.
            childPath = null;
        } else {
            childPath = this.path == null ? null : this.path.child(field);
        }
        var context = new ParseContext(this.dataSource, this.methodName, childPath, this.fieldTransforms, this.fieldMask);
        if (typeof field === 'string') {
            // We only need to validate the new segment.
            context.validatePathSegment(field);
        } else if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object' && field instanceof _path.FieldPath) {
            // Validate the whole path.
            context.validatePath();
        }
        return context;
    };
    ParseContext.prototype.createError = function (reason) {
        var fieldDescription = this.path === null || this.path.isEmpty() ? '' : " (found in field " + this.path.toString() + ")";
        return new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + this.methodName + "() called with invalid data. " + reason + fieldDescription);
    };
    ParseContext.prototype.validatePath = function () {
        // TODO(b/34871131): Remove null check once we have proper paths for fields
        // within arrays.
        if (this.path === null) {
            return;
        }
        for (var i = 0; i < this.path.length; i++) {
            this.validatePathSegment(this.path.get(i));
        }
    };
    ParseContext.prototype.validatePathSegment = function (segment) {
        if (this.isWrite() && RESERVED_FIELD_REGEX.test(segment)) {
            throw this.createError('Document fields cannot begin and end with __');
        }
    };
    ParseContext.prototype.isWrite = function () {
        return this.dataSource === UserDataSource.Set || this.dataSource === UserDataSource.Update;
    };
    return ParseContext;
}();
/**
 * A placeholder object for DocumentReferences in this file, in order to
 * avoid a circular dependency. See the comments for `DataPreConverter` for
 * the full context.
 */
var DocumentKeyReference = /** @class */function () {
    function DocumentKeyReference(databaseId, key) {
        this.databaseId = databaseId;
        this.key = key;
    }
    return DocumentKeyReference;
}();
exports.DocumentKeyReference = DocumentKeyReference;
/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */

var UserDataConverter = /** @class */function () {
    function UserDataConverter(preConverter) {
        this.preConverter = preConverter;
    }
    /** Parse document data (e.g. from a set() call). */
    UserDataConverter.prototype.parseSetData = function (methodName, input, options) {
        var _this = this;
        var context = new ParseContext(UserDataSource.Set, methodName, _path.FieldPath.EMPTY_PATH);
        validatePlainObject('Data must be an object, but it was:', context, input);
        var merge = options.merge !== undefined ? options.merge : false;
        var updateData = _field_value.ObjectValue.EMPTY;
        objUtils.forEach(input, function (key, value) {
            var path = new _field_path.FieldPath(key)._internalPath;
            var childContext = context.childContext(path);
            value = _this.runPreConverter(value, childContext);
            var parsedValue = _this.parseData(value, childContext);
            if (parsedValue) {
                updateData = updateData.set(path, parsedValue);
            }
        });
        var fieldMask = merge ? new _mutation.FieldMask(context.fieldMask) : null;
        return new ParsedSetData(updateData, fieldMask, context.fieldTransforms);
    };
    /** Parse update data (e.g. from an update() call). */
    UserDataConverter.prototype.parseUpdateData = function (methodName, input) {
        var _this = this;
        var context = new ParseContext(UserDataSource.Update, methodName, _path.FieldPath.EMPTY_PATH);
        validatePlainObject('Data must be an object, but it was:', context, input);
        var fieldMaskPaths = [];
        var updateData = _field_value.ObjectValue.EMPTY;
        objUtils.forEach(input, function (key, value) {
            var path = fieldPathFromDotSeparatedString(methodName, key);
            var childContext = context.childContext(path);
            value = _this.runPreConverter(value, childContext);
            if (value instanceof _field_value2.DeleteFieldValueImpl) {
                // Add it to the field mask, but don't add anything to updateData.
                fieldMaskPaths.push(path);
            } else {
                var parsedValue = _this.parseData(value, childContext);
                if (parsedValue != null) {
                    fieldMaskPaths.push(path);
                    updateData = updateData.set(path, parsedValue);
                }
            }
        });
        var mask = new _mutation.FieldMask(fieldMaskPaths);
        return new ParsedUpdateData(updateData, mask, context.fieldTransforms);
    };
    /** Parse update data from a list of field/value arguments. */
    UserDataConverter.prototype.parseUpdateVarargs = function (methodName, field, value, moreFieldsAndValues) {
        var context = new ParseContext(UserDataSource.Update, methodName, _path.FieldPath.EMPTY_PATH);
        var keys = [fieldPathFromArgument(methodName, field)];
        var values = [value];
        if (moreFieldsAndValues.length % 2 !== 0) {
            throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + methodName + "() needs to be called with an even number " + 'of arguments that alternate between field names and values.');
        }
        for (var i = 0; i < moreFieldsAndValues.length; i += 2) {
            keys.push(fieldPathFromArgument(methodName, moreFieldsAndValues[i]));
            values.push(moreFieldsAndValues[i + 1]);
        }
        var fieldMaskPaths = [];
        var updateData = _field_value.ObjectValue.EMPTY;
        for (var i = 0; i < keys.length; ++i) {
            var path = keys[i];
            var childContext = context.childContext(path);
            var value_1 = this.runPreConverter(values[i], childContext);
            if (value_1 instanceof _field_value2.DeleteFieldValueImpl) {
                // Add it to the field mask, but don't add anything to updateData.
                fieldMaskPaths.push(path);
            } else {
                var parsedValue = this.parseData(value_1, childContext);
                if (parsedValue != null) {
                    fieldMaskPaths.push(path);
                    updateData = updateData.set(path, parsedValue);
                }
            }
        }
        var mask = new _mutation.FieldMask(fieldMaskPaths);
        return new ParsedUpdateData(updateData, mask, context.fieldTransforms);
    };
    /**
     * Parse a "query value" (e.g. value in a where filter or a value in a cursor
     * bound).
     */
    UserDataConverter.prototype.parseQueryValue = function (methodName, input) {
        var context = new ParseContext(UserDataSource.QueryValue, methodName, _path.FieldPath.EMPTY_PATH);
        var parsed = this.parseData(input, context);
        (0, _assert.assert)(parsed != null, 'Parsed data should not be null.');
        (0, _assert.assert)(context.fieldTransforms.length === 0, 'Field transforms should have been disallowed.');
        return parsed;
    };
    /** Sends data through this.preConverter, handling any thrown errors. */
    UserDataConverter.prototype.runPreConverter = function (input, context) {
        try {
            return this.preConverter(input);
        } catch (e) {
            var message = errorMessage(e);
            throw context.createError(message);
        }
    };
    /**
     * Internal helper for parsing user data.
     *
     * @param input Data to be parsed.
     * @param context A context object representing the current path being parsed,
     * the source of the data being parsed, etc.
     * @return The parsed value, or null if the value was a FieldValue sentinel
     * that should not be included in the resulting parsed data.
     */
    UserDataConverter.prototype.parseData = function (input, context) {
        input = this.runPreConverter(input, context);
        if (input instanceof Array) {
            // TODO(b/34871131): We may need a different way to detect nested arrays
            // once we support array paths (at which point we should include the path
            // containing the array in the error message).
            if (!context.path) {
                throw context.createError('Nested arrays are not supported');
            }
            // We don't support field mask paths more granular than the top-level
            // array.
            context.fieldMask.push(context.path);
            return this.parseArray(input, context);
        } else if (looksLikeJsonObject(input)) {
            validatePlainObject('Unsupported field value:', context, input);
            return this.parseObject(input, context);
        } else {
            // If context.path is null, we are inside an array and we should have
            // already added the root of the array to the field mask.
            if (context.path) {
                context.fieldMask.push(context.path);
            }
            return this.parseScalarValue(input, context);
        }
    };
    UserDataConverter.prototype.parseArray = function (array, context) {
        var result = [];
        var entryIndex = 0;
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var entry = array_1[_i];
            var parsedEntry = this.parseData(entry, context.childContext(entryIndex));
            if (parsedEntry == null) {
                // Just include nulls in the array for fields being replaced with a
                // sentinel.
                parsedEntry = _field_value.NullValue.INSTANCE;
            }
            result.push(parsedEntry);
            entryIndex++;
        }
        return new _field_value.ArrayValue(result);
    };
    UserDataConverter.prototype.parseObject = function (obj, context) {
        var _this = this;
        var result = new _sorted_map.SortedMap(_misc.primitiveComparator);
        objUtils.forEach(obj, function (key, val) {
            var parsedValue = _this.parseData(val, context.childContext(key));
            if (parsedValue != null) {
                result = result.insert(key, parsedValue);
            }
        });
        return new _field_value.ObjectValue(result);
    };
    /**
     * Helper to parse a scalar value (i.e. not an Object or Array)
     *
     * @return The parsed value, or null if the value was a FieldValue sentinel
     * that should not be included in the resulting parsed data.
     */
    UserDataConverter.prototype.parseScalarValue = function (value, context) {
        if (value === null) {
            return _field_value.NullValue.INSTANCE;
        } else if (typeof value === 'number') {
            if (typeUtils.isSafeInteger(value)) {
                return new _field_value.IntegerValue(value);
            } else {
                return new _field_value.DoubleValue(value);
            }
        } else if (typeof value === 'boolean') {
            return _field_value.BooleanValue.of(value);
        } else if (typeof value === 'string') {
            return new _field_value.StringValue(value);
        } else if (value instanceof Date) {
            return new _field_value.TimestampValue(_timestamp.Timestamp.fromDate(value));
        } else if (value instanceof _geo_point.GeoPoint) {
            return new _field_value.GeoPointValue(value);
        } else if (value instanceof _blob.Blob) {
            return new _field_value.BlobValue(value);
        } else if (value instanceof DocumentKeyReference) {
            return new _field_value.RefValue(value.databaseId, value.key);
        } else if (value instanceof _field_value2.FieldValueImpl) {
            if (value instanceof _field_value2.DeleteFieldValueImpl) {
                // We shouldn't encounter delete sentinels here. Provide a good error.
                if (context.dataSource !== UserDataSource.Update) {
                    throw context.createError('FieldValue.delete() can only be used with update()');
                } else {
                    (0, _assert.assert)(context.path == null || context.path.length > 0, 'FieldValue.delete() at the top level should have already' + ' been handled.');
                    throw context.createError('FieldValue.delete() can only appear at the top level ' + 'of your update data');
                }
            } else if (value instanceof _field_value2.ServerTimestampFieldValueImpl) {
                if (context.dataSource !== UserDataSource.Set && context.dataSource !== UserDataSource.Update) {
                    throw context.createError('FieldValue.serverTimestamp() can only be used with set()' + ' and update()');
                }
                if (context.path === null) {
                    throw context.createError('FieldValue.serverTimestamp() is not currently' + ' supported inside arrays');
                }
                context.fieldTransforms.push(new _mutation.FieldTransform(context.path, _mutation.ServerTimestampTransform.instance));
                // Return null so this value is omitted from the parsed result.
                return null;
            } else {
                return (0, _assert.fail)('Unknown FieldValue type: ' + value);
            }
        } else {
            throw context.createError("Unsupported field value: " + (0, _input_validation.valueDescription)(value));
        }
    };
    return UserDataConverter;
}();
exports.UserDataConverter = UserDataConverter;
/**
 * Checks whether an object looks like a JSON object that should be converted
 * into a struct. Normal class/prototype instances are considered to look like
 * JSON objects since they should be converted to a struct value. Arrays, Dates,
 * GeoPoints, etc. are not considered to look like JSON objects since they map
 * to specific FieldValue types other than ObjectValue.
 */

function looksLikeJsonObject(input) {
    return (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input !== null && !(input instanceof Array) && !(input instanceof Date) && !(input instanceof _geo_point.GeoPoint) && !(input instanceof _blob.Blob) && !(input instanceof DocumentKeyReference) && !(input instanceof _field_value2.FieldValueImpl);
}
function validatePlainObject(message, context, input) {
    if (!looksLikeJsonObject(input) || !(0, _input_validation.isPlainObject)(input)) {
        var description = (0, _input_validation.valueDescription)(input);
        if (description === 'an object') {
            // Massage the error if it was an object.
            throw context.createError(message + ' a custom object');
        } else {
            throw context.createError(message + ' ' + description);
        }
    }
}
/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */
function fieldPathFromArgument(methodName, path) {
    if (path instanceof _field_path.FieldPath) {
        return path._internalPath;
    } else if (typeof path === 'string') {
        return fieldPathFromDotSeparatedString(methodName, path);
    } else {
        var message = 'Field path arguments must be of type string or FieldPath.';
        throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + methodName + "() called with invalid data. " + message);
    }
}
/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName The publicly visible method name
 * @param path The dot-separated string form of a field path which will be split
 * on dots.
 */
function fieldPathFromDotSeparatedString(methodName, path) {
    try {
        return (0, _field_path.fromDotSeparatedString)(path)._internalPath;
    } catch (e) {
        var message = errorMessage(e);
        throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + methodName + "() called with invalid data. " + message);
    }
}
/**
 * Extracts the message from a caught exception, which should be an Error object
 * though JS doesn't guarantee that.
 */
function errorMessage(error) {
    return error instanceof Error ? error.message : error.toString();
}
//# sourceMappingURL=user_data_converter.js.map
