"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHsscFromCookie = getHsscFromCookie;

var _constants = require("../cookies/constants");

var _operators = require("../cookies/operators");

function getHsscFromCookie() {
  return (0, _operators.getCookie)(_constants.cookies.HSSC);
}