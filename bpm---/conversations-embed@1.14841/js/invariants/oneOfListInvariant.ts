"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oneOfListInvariant = oneOfListInvariant;

var _invariant = _interopRequireDefault(require("../utils/invariant"));

function oneOfListInvariant(potentialVar, potentialVarName, listOfOptions) {
  (0, _invariant.default)(listOfOptions.indexOf(potentialVar) > -1, `Expected %s to be one of ${listOfOptions.toString()} but got %s`, potentialVarName, potentialVar);
}