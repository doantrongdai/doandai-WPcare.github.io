"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */
const invariant = (condition, format, ...args) => {
  if (!condition) {
    let error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      let argIndex = 0;
      error = new Error(`Invariant Violation: ${format.replace(/%s/g, () => {
        return args[argIndex++];
      })}`);
    }

    throw error;
  }
};

var _default = invariant;
exports.default = _default;
module.exports = exports.default;