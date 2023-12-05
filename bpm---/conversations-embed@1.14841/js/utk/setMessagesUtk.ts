"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMessagesUtk = setMessagesUtk;

var _operators = require("../cookies/operators");

var _constants = require("../cookies/constants");

function setMessagesUtk(value) {
  (0, _operators.setCookie)(_constants.cookies.MESSAGES, value);
}