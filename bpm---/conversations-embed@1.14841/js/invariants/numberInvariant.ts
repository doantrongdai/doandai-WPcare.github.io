"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberInvariant = void 0;

var _invariant = _interopRequireDefault(require("../utils/invariant"));

const numberInvariant = (potentialNumber, numberName = '') => (0, _invariant.default)(typeof potentialNumber === 'number', 'Expected %s to be a number, not a %s', numberName || potentialNumber, typeof potentialNumber);

exports.numberInvariant = numberInvariant;