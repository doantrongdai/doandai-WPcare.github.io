"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetAndLaunchWidget = void 0;

var _clearCookies = require("../cookies/clearCookies");

var _startOnceReady = require("../startOnceReady");

var _constants = require("./constants");

const resetAndLaunchWidget = () => {
  (0, _clearCookies.clearCookies)();
  window[_constants.USER_TOKEN_KEY] = '';
  window.hubspot_live_messages_running = false;
  (0, _startOnceReady.startOnceReady)();
};

exports.resetAndLaunchWidget = resetAndLaunchWidget;