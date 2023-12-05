"use strict";

/* eslint-disable no-cond-assign, no-empty */
'use es6'; // pulled from https://github.com/getsentry/sentry-javascript/blob/3.x/packages/raven-js/vendor/TraceKit/tracekit.js
// Contents of Exception in various browsers.
//
// SAFARI:
// ex.message = Can't find variable: qq
// ex.line = 59
// ex.sourceId = 580238192
// ex.sourceURL = http://...
// ex.expressionBeginOffset = 96
// ex.expressionCaretOffset = 98
// ex.expressionEndOffset = 98
// ex.name = ReferenceError
//
// FIREFOX:
// ex.message = qq is not defined
// ex.fileName = http://...
// ex.lineNumber = 59
// ex.columnNumber = 69
// ex.stack = ...stack trace... (see the example below)
// ex.name = ReferenceError
//
// CHROME:
// ex.message = qq is not defined
// ex.name = ReferenceError
// ex.type = not_defined
// ex.arguments = ['aa']
// ex.stack = ...stack trace...
//
// INTERNET EXPLORER:
// ex.message = ...
// ex.name = ReferenceError
//
// OPERA:
// ex.message = ...message... (see the example below)
// ex.name = ReferenceError
// ex.opera#sourceloc = 11  (pretty much useless, duplicates the info in ex.message)
// ex.stacktrace = n/a; see 'opera:config#UserPrefs|Exceptions Have Stacktrace'

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.computeStackTrace = computeStackTrace;
const UNKNOWN_FUNCTION = '?';

function getLocationHref() {
    if (typeof document === 'undefined' || document.location == null) return '';
    return document.location.href;
}

function getLocationOrigin() {
    if (typeof document === 'undefined' || document.location == null) return ''; // Oh dear IE10...

    if (!document.location.origin) {
        return `${document.location.protocol}//${document.location.hostname}${document.location.port ? `:${document.location.port}` : ''}`;
    }

    return document.location.origin;
}
/**
 * Computes stack trace information from the stack property.
 * Chrome and Gecko use this property.
 * @param {Error} ex
 * @return {?Object.<string, *>} Stack trace information.
 */


function computeStackTraceFromStackProp(ex) {
    if (typeof ex.stack === 'undefined' || !ex.stack) return null;
    const chrome = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
    const winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i; // NOTE: blob urls are now supposed to always have an origin, therefore it's format
    // which is `blob:http://url/path/with-some-uuid`, is matched by `blob.*?:\/` as well

    const gecko = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i; // Used to additionally parse URL/line/column from eval frames

    const geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    const chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/;
    const lines = ex.stack.split('\n');
    const stack = [];
    let submatch;
    let parts;
    let element;

    for (let i = 0, j = lines.length; i < j; ++i) {
        if (parts = chrome.exec(lines[i])) {
            const isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line

            const isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line

            if (isEval && (submatch = chromeEval.exec(parts[2]))) {
                // throw out eval line/column and use top-most line/column number
                parts[2] = submatch[1]; // url

                parts[3] = submatch[2]; // line

                parts[4] = submatch[3]; // column
            }

            element = {
                filename: !isNative ? parts[2] : null,
                function: parts[1] || UNKNOWN_FUNCTION,
                args: isNative ? [parts[2]] : [],
                lineno: parts[3] ? +parts[3] : null,
                colno: parts[4] ? +parts[4] : null
            };
        } else if (parts = winjs.exec(lines[i])) {
            element = {
                filename: parts[2],
                function: parts[1] || UNKNOWN_FUNCTION,
                args: [],
                lineno: +parts[3],
                colno: parts[4] ? +parts[4] : null
            };
        } else if (parts = gecko.exec(lines[i])) {
            const isEval = parts[3] && parts[3].indexOf(' > eval') > -1;

            if (isEval && (submatch = geckoEval.exec(parts[3]))) {
                // throw out eval line/column and use top-most line number
                parts[3] = submatch[1];
                parts[4] = submatch[2];
                parts[5] = null; // no column when eval
            } else if (i === 0 && !parts[5] && typeof ex.columnNumber !== 'undefined') {
                // FireFox uses this awesome columnNumber property for its top frame
                // Also note, Firefox's column number is 0-based and everything else expects 1-based,
                // so adding 1
                // NOTE: this hack doesn't work if top-most frame is eval
                stack[0].column = ex.columnNumber + 1;
            }

            element = {
                filename: parts[3],
                function: parts[1] || UNKNOWN_FUNCTION,
                args: parts[2] ? parts[2].split(',') : [],
                lineno: parts[4] ? +parts[4] : null,
                colno: parts[5] ? +parts[5] : null
            };
        } else {
            continue;
        }

        if (!element.function && element.line) {
            element.function = UNKNOWN_FUNCTION;
        }

        if (element.filename && element.filename.substr(0, 5) === 'blob:') {
            // Special case for handling JavaScript loaded into a blob.
            // We use a synchronous AJAX request here as a blob is already in
            // memory - it's not making a network request.  This will generate a warning
            // in the browser console, but there has already been an error so that's not
            // that much of an issue.
            const xhr = new XMLHttpRequest();
            xhr.open('GET', element.filename, false);
            xhr.send(null); // If we failed to download the source, skip this patch

            if (xhr.status === 200) {
                let source = xhr.responseText || ''; // We trim the source down to the last 300 characters as sourceMappingURL is always at the end of the file.
                // Why 300? To be in line with: https://github.com/getsentry/sentry/blob/4af29e8f2350e20c28a6933354e4f42437b4ba42/src/sentry/lang/javascript/processor.py#L164-L175

                source = source.slice(-300); // Now we dig out the source map URL

                const sourceMaps = source.match(/\/\/# sourceMappingURL=(.*)$/); // If we don't find a source map comment or we find more than one, continue on to the next element.

                if (sourceMaps) {
                    let sourceMapAddress = sourceMaps[1]; // Now we check to see if it's a relative URL.
                    // If it is, convert it to an absolute one.

                    if (sourceMapAddress.charAt(0) === '~') {
                        sourceMapAddress = getLocationOrigin() + sourceMapAddress.slice(1);
                    } // Now we strip the '.map' off of the end of the URL and update the
                    // element so that Sentry can match the map to the blob.


                    element.url = sourceMapAddress.slice(0, -4);
                }
            }
        }

        stack.push(element);
    }

    if (!stack.length) {
        return null;
    }

    return {
        name: ex.name,
        message: ex.message,
        url: getLocationHref(),
        stack
    };
}
/**
 * Adds information about the first frame to incomplete stack traces.
 * Safari and IE require this to get complete data on the first frame.
 * @param {Object.<string, *>} stackInfo Stack trace information from
 * one of the compute* methods.
 * @param {string} url The URL of the script that caused an error.
 * @param {(number|string)} lineNo The line number of the script that
 * caused an error.
 * @return {boolean} Whether or not the stack information was
 * augmented.
 */


function augmentStackTraceWithInitialElement(stackInfo, filename, lineno) {
    const initial = {
        filename,
        lineno
    };

    if (initial.filename && initial.lineno) {
        stackInfo.incomplete = false;

        if (!initial.function) {
            initial.function = UNKNOWN_FUNCTION;
        }

        if (stackInfo.stack.length > 0) {
            if (stackInfo.stack[0].filename === initial.filename) {
                if (stackInfo.stack[0].lineno === initial.lineno) {
                    return false; // already in stack trace
                } else if (!stackInfo.stack[0].lineno && stackInfo.stack[0].function === initial.function) {
                    stackInfo.stack[0].lineno = initial.lineno;
                    return false;
                }
            }
        }

        stackInfo.stack.unshift(initial);
        stackInfo.partial = true;
        return true;
    } else {
        stackInfo.incomplete = true;
    }

    return false;
}
/**
 * Computes stack trace information by walking the arguments.caller
 * chain at the time the exception occurred. This will cause earlier
 * frames to be missed but is the only way to get any stack trace in
 * Safari and IE. The top frame is restored by
 * {@link augmentStackTraceWithInitialElement}.
 * @param {Error} ex
 * @return {?Object.<string, *>} Stack trace information.
 */


function computeStackTraceByWalkingCallerChain(ex, depth) {
    const functionName = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i;
    const stack = [];
    const funcs = {};
    let recursion = false;
    let parts;
    let item;

    for (let curr = computeStackTraceByWalkingCallerChain.caller; curr && !recursion; curr = curr.caller) {
        if (curr === computeStackTrace) {
            continue;
        }

        item = {
            filename: null,
            function: UNKNOWN_FUNCTION,
            lineno: null,
            colno: null
        };

        if (curr.name) {
            item.function = curr.name;
        } else if (parts = functionName.exec(curr.toString())) {
            item.function = parts[1];
        }

        if (typeof item.function === 'undefined') {
            try {
                item.function = parts.input.substring(0, parts.input.indexOf('{'));
            } catch (e) {}
        }

        if (funcs[`${curr}`]) {
            recursion = true;
        } else {
            funcs[`${curr}`] = true;
        }

        stack.push(item);
    }

    if (depth) {
        // console.log('depth is ' + depth);
        // console.log('stack is ' + stack.length);
        stack.splice(0, depth);
    }

    const result = {
        name: ex.name,
        message: ex.message,
        filename: getLocationHref(),
        stack
    };
    augmentStackTraceWithInitialElement(result, ex.sourceURL || ex.fileName, ex.line || ex.lineNumber, ex.message || ex.description);
    return result;
}
/**
 * Computes a stack trace for an exception.
 * @param {Error} ex
 * @param {(string|number)=} depth
 */


function computeStackTrace(ex, depth) {
    let stack = null;
    depth = depth == null ? 0 : +depth;

    try {
        stack = computeStackTraceFromStackProp(ex);

        if (stack) {
            return stack;
        }
    } catch (e) {}

    try {
        stack = computeStackTraceByWalkingCallerChain(ex, depth + 1);

        if (stack) {
            return stack;
        }
    } catch (e) {}

    return {
        name: ex.name,
        message: ex.message,
        filename: getLocationHref()
    };
}