"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringInvariant = void 0;

var _invariant = _interopRequireDefault(require("../utils/invariant"));

const stringInvariant = (potentialString, stringName = '') => (0, _invariant.default)(typeof potentialString === 'string', 'Expected %s to be a string, not a %s', stringName || potentialString, typeof potentialString);

exports.stringInvariant = stringInvariant;