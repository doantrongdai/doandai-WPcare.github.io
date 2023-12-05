"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalCookieOptOut = getGlobalCookieOptOut;

var _operators = require("../cookies/operators");

var _constants = require("../cookies/constants");

function getGlobalCookieOptOut() {
  return (0, _operators.getCookie)(_constants.cookies.GLOBAL_COOKIE_OPT_OUT);
}