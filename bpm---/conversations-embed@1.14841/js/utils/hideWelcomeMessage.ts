"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideWelcomeMessage = void 0;

var _constants = require("../cookies/constants");

var _operators = require("../cookies/operators");

var _times = _interopRequireDefault(require("../cookies/times"));

const hideWelcomeMessage = () => {
  (0, _operators.setCookie)(_constants.cookies.HIDE_WELCOME_MESSAGE, true, _times.default.THIRTY_MINUTES);
};

exports.hideWelcomeMessage = hideWelcomeMessage;