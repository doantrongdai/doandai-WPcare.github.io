"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearCookies = clearCookies;

var _constants = require("./constants");

var _deleteCookie = require("./deleteCookie");

var _startOnceReady = require("../startOnceReady");

var _extendedFunctions = require("../constants/extendedFunctions");

/**
 * Clear visitor widget-specific cookies from the parent page
 */
function clearCookies(extendedFunction) {
  (0, _deleteCookie.deleteCookie)(_constants.cookies.MESSAGES);
  (0, _deleteCookie.deleteCookie)(_constants.cookies.IS_OPEN);
  (0, _deleteCookie.deleteCookie)(_constants.cookies.HIDE_WELCOME_MESSAGE);
  (0, _deleteCookie.deleteCookie)(`${_constants.cookies.WIDGET_POSITION}_right`);
  (0, _deleteCookie.deleteCookie)(`${_constants.cookies.WIDGET_POSITION}_left`);

  if (extendedFunction && extendedFunction[_extendedFunctions.RESET_WIDGET]) {
    window.hubspot_live_messages_running = false;
    (0, _startOnceReady.startOnceReady)();
  }
}