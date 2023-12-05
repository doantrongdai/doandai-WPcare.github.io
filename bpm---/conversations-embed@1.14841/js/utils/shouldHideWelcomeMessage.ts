"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldHideWelcomeMessage = shouldHideWelcomeMessage;

var _operators = require("../cookies/operators");

var _constants = require("../cookies/constants");

function shouldHideWelcomeMessage() {
  return !!(0, _operators.getCookie)(_constants.cookies.HIDE_WELCOME_MESSAGE) || false;
}