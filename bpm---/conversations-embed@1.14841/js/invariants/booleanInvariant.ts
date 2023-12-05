"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.booleanInvariant = void 0;

var _invariant = _interopRequireDefault(require("../utils/invariant"));

const booleanInvariant = (potentialBoolean, booleanName) => (0, _invariant.default)(potentialBoolean === true || potentialBoolean === false, `Expected %s to be a boolean but received a %s`, booleanName || potentialBoolean, typeof potentialBoolean);

exports.booleanInvariant = booleanInvariant;