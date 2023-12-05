"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldWidgetStartOpen = shouldWidgetStartOpen;

var _cookieIsSet = require("../cookies/cookieIsSet");

var _operators = require("../cookies/operators");

var _settingsHelpers = require("../external-api/settingsHelpers");

var _constants = require("../cookies/constants");

var _urlHasHsChatHashLink = require("./urlHasHsChatHashLink");

var _stringToBoolean = require("./stringToBoolean");

/**
 * Specifies whether or not the widget must immediately start in an open or closed state, based
 * on conditions on the page.
 * If this function returns `true`, it must immediately start open.
 * If this function returns `false`, it must immediately start closed.
 * If this function returns `undefined`, then the embed script does not enforce any
 * particular open/closed state. It defers to the visitor UI to open or close the widget
 * based on the chatflow settings.
 * @return {?boolean} - whether or not the widget must start open
 */
function shouldWidgetStartOpen() {
  const inline = (0, _settingsHelpers.shouldEmbedInline)();

  if (!inline && (0, _cookieIsSet.cookieIsSet)(_constants.cookies.IS_OPEN)) {
    const isOpenCookie = (0, _operators.getCookie)(_constants.cookies.IS_OPEN);
    return (0, _stringToBoolean.stringToBoolean)(isOpenCookie);
  }

  return inline || (0, _urlHasHsChatHashLink.urlHasHsChatHashLink)(window.location.href) || undefined;
}