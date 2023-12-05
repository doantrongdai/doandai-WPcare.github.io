"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectInvariant = void 0;

var _invariant = _interopRequireDefault(require("../utils/invariant"));

const objectInvariant = (potentialObject, objectName = '') => (0, _invariant.default)(typeof potentialObject === 'object' && potentialObject !== null, `Expected %s to be an object`, objectName || potentialObject);

exports.objectInvariant = objectInvariant;