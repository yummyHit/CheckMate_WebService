/*! @license Firebase v4.5.0
Build: rev-f49c8b5
Terms: https://firebase.google.com/terms/ */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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


exports.validateExactNumberOfArgs = validateExactNumberOfArgs;
exports.validateAtLeastNumberOfArgs = validateAtLeastNumberOfArgs;
exports.validateBetweenNumberOfArgs = validateBetweenNumberOfArgs;
exports.validateNamedArrayAtLeastNumberOfElements = validateNamedArrayAtLeastNumberOfElements;
exports.validateArgType = validateArgType;
exports.validateOptionalArgType = validateOptionalArgType;
exports.validateNamedType = validateNamedType;
exports.validateNamedOptionalType = validateNamedOptionalType;
exports.isPlainObject = isPlainObject;
exports.valueDescription = valueDescription;
exports.tryGetCustomObjectType = tryGetCustomObjectType;
exports.validateDefined = validateDefined;
exports.validateOptionNames = validateOptionNames;
exports.invalidClassError = invalidClassError;

var _assert = require('./assert');

var _error = require('./error');

var _obj = require('./obj');

var obj = _interopRequireWildcard(_obj);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Validates the invocation of functionName has the exact number of arguments.
 *
 * Forward the magic "arguments" variable as second parameter on which the
 * parameter validation is performed:
 * validateExactNumberOfArgs('myFunction', arguments, 2);
 */
function validateExactNumberOfArgs(functionName, args, numberOfArgs) {
    if (args.length !== numberOfArgs) {
        throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + functionName + "() requires " + formatPlural(numberOfArgs, 'argument') + ', but was called with ' + formatPlural(args.length, 'argument') + '.');
    }
}
/**
 * Validates the invocation of functionName has at least the provided number of
 * arguments (but can have many more).
 *
 * Forward the magic "arguments" variable as second parameter on which the
 * parameter validation is performed:
 * validateAtLeastNumberOfArgs('myFunction', arguments, 2);
 */
function validateAtLeastNumberOfArgs(functionName, args, minNumberOfArgs) {
    if (args.length < minNumberOfArgs) {
        throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + functionName + "() requires at least " + formatPlural(minNumberOfArgs, 'argument') + ', but was called with ' + formatPlural(args.length, 'argument') + '.');
    }
}
/**
 * Validates the invocation of functionName has number of arguments between
 * the values provided.
 *
 * Forward the magic "arguments" variable as second parameter on which the
 * parameter validation is performed:
 * validateBetweenNumberOfArgs('myFunction', arguments, 2, 3);
 */
function validateBetweenNumberOfArgs(functionName, args, minNumberOfArgs, maxNumberOfArgs) {
    if (args.length < minNumberOfArgs || args.length > maxNumberOfArgs) {
        throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + functionName + "() requires between " + minNumberOfArgs + " and " + (maxNumberOfArgs + " arguments, but was called with ") + formatPlural(args.length, 'argument') + '.');
    }
}
/**
 * Validates the provided argument is an array and has as least the expected
 * number of elements.
 */
function validateNamedArrayAtLeastNumberOfElements(functionName, value, name, minNumberOfElements) {
    if (!(value instanceof Array) || value.length < minNumberOfElements) {
        throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + functionName + "() requires its " + name + " argument to be an " + 'array with at least ' + (formatPlural(minNumberOfElements, 'element') + "."));
    }
}
/**
 * Validates the provided positional argument has the native JavaScript type
 * using typeof checks.
 */
function validateArgType(functionName, type, position, argument) {
    validateType(functionName, type, ordinal(position) + " argument", argument);
}
/**
 * Validates the provided argument has the native JavaScript type using
 * typeof checks or is undefined.
 */
function validateOptionalArgType(functionName, type, position, argument) {
    if (argument !== undefined) {
        validateArgType(functionName, type, position, argument);
    }
}
/**
 * Validates the provided named option has the native JavaScript type using
 * typeof checks.
 */
function validateNamedType(functionName, type, optionName, argument) {
    validateType(functionName, type, optionName + " option", argument);
}
/**
 * Validates the provided named option has the native JavaScript type using
 * typeof checks or is undefined.
 */
function validateNamedOptionalType(functionName, type, optionName, argument) {
    if (argument !== undefined) {
        validateNamedType(functionName, type, optionName, argument);
    }
}
/** Helper to validate the type of a provided input. */
function validateType(functionName, type, inputName, input) {
    if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== type || type === 'object' && !isPlainObject(input)) {
        var description = valueDescription(input);
        throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + functionName + "() requires its " + inputName + " " + ("to be of type " + type + ", but it was: " + description));
    }
}
/**
 * Returns true iff it's a non-null object without a custom prototype
 * (i.e. excludes Array, Date, etc.).
 */
function isPlainObject(input) {
    return (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input !== null && Object.getPrototypeOf(input) === Object.prototype;
}
/** Returns a string describing the type / value of the provided input. */
function valueDescription(input) {
    if (input === undefined) {
        return 'undefined';
    } else if (input === null) {
        return 'null';
    } else if (typeof input === 'string') {
        if (input.length > 20) {
            input = input.substring(0, 20) + "...";
        }
        return JSON.stringify(input);
    } else if (typeof input === 'number' || typeof input === 'boolean') {
        return '' + input;
    } else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
        if (input instanceof Array) {
            return 'an array';
        } else {
            var customObjectName = tryGetCustomObjectType(input);
            if (customObjectName) {
                return "a custom " + customObjectName + " object";
            } else {
                return 'an object';
            }
        }
    } else if (typeof input === 'function') {
        return 'a function';
    } else {
        return (0, _assert.fail)('Unknown wrong type: ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)));
    }
}
/** Hacky method to try to get the constructor name for an object. */
function tryGetCustomObjectType(input) {
    if (input.constructor) {
        var funcNameRegex = /function\s+([^\s(]+)\s*\(/;
        var results = funcNameRegex.exec(input.constructor.toString());
        if (results && results.length > 1) {
            return results[1];
        }
    }
    return null;
}
/** Validates the provided argument is defined. */
function validateDefined(functionName, position, argument) {
    if (argument === undefined) {
        throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + functionName + "() requires a valid " + ordinal(position) + " " + "argument, but it was undefined.");
    }
}
/**
 * Validates the provided positional argument is an object, and its keys and
 * values match the expected keys and types provided in optionTypes.
 */
function validateOptionNames(functionName, options, optionNames) {
    obj.forEach(options, function (key, _) {
        if (optionNames.indexOf(key) < 0) {
            throw new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Unknown option '" + key + "' passed to function " + functionName + "(). " + 'Available options: ' + optionNames.join(', '));
        }
    });
}
/**
 * Helper method to throw an error that the provided argument did not pass
 * an instanceof check.
 */
function invalidClassError(functionName, type, position, argument) {
    var description = valueDescription(argument);
    return new _error.FirestoreError(_error.Code.INVALID_ARGUMENT, "Function " + functionName + "() requires its " + ordinal(position) + " " + ("argument to be a " + type + ", but it was: " + description));
}
/** Converts a number to its english word representation */
function ordinal(num) {
    switch (num) {
        case 1:
            return 'first';
        case 2:
            return 'second';
        case 3:
            return 'third';
        default:
            return num + 'th';
    }
}
/**
 * Formats the given word as plural conditionally given the preceding number.
 */
function formatPlural(num, str) {
    return num + " " + str + (num === 1 ? '' : 's');
}
//# sourceMappingURL=input_validation.js.map
