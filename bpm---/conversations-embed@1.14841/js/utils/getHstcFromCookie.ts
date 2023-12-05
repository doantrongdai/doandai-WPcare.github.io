"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHstcFromCookie = getHstcFromCookie;

var _constants = require("../cookies/constants");

var _operators = require("../cookies/operators");

function getHstcFromCookie() {
  return (0, _operators.getCookie)(_constants.cookies.HSTC);
}