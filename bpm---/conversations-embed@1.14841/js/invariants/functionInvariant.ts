"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionInvariant = void 0;

var _invariant = _interopRequireDefault(require("../utils/invariant"));

const functionInvariant = potentialFunction => (0, _invariant.default)(typeof potentialFunction === 'function' && potentialFunction !== null, `Expected %s to be a function`, potentialFunction);

exports.functionInvariant = functionInvariant;