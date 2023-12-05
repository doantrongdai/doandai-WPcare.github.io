"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareVisitorIdentifiers = void 0;

var _chooseMessagesUtk = require("./chooseMessagesUtk");

var _getMessagesUtkFromCookie = require("./getMessagesUtkFromCookie");

var _getHubSpotUtkFromCookie = require("./getHubSpotUtkFromCookie");

var _getGlobalCookieOptOut = require("./getGlobalCookieOptOut");

var _getHstcFromCookie = require("../utils/getHstcFromCookie");

var _getHsscFromCookie = require("../utils/getHsscFromCookie");

var _setMessagesUtk = require("./setMessagesUtk");

const prepareVisitorIdentifiers = () => {
  /**
   * We check for a `messagesUtk` cookie
   * If it's present AND a uuid, use it
   * If not, store it in memory and wait for the visitor-ui to prompt
   * the shell to set it to a cookie
   */
  const existingMessagesUtk = (0, _getMessagesUtkFromCookie.getMessagesUtkFromCookie)();

  if (existingMessagesUtk) {
    /**
     * If there is already a messagesUtk cookie value, reset the cookie
     * to ensure it has the proper expiry (13 months)
     */
    (0, _setMessagesUtk.setMessagesUtk)(existingMessagesUtk);
  }
  /**
   * The analytics script drops a `hubspotUtk` cookie
   * If GDPR is enabled and consent has not been given,
   * it may not be present
   */


  const hubspotUtk = (0, _getHubSpotUtkFromCookie.getHubSpotUtkFromCookie)();
  const hstc = (0, _getHstcFromCookie.getHstcFromCookie)();
  const hssc = (0, _getHsscFromCookie.getHsscFromCookie)();
  const globalCookieOptOut = (0, _getGlobalCookieOptOut.getGlobalCookieOptOut)();
  const {
    messagesUtk,
    isFirstVisitorSession
  } = (0, _chooseMessagesUtk.chooseMessagesUtk)({
    existingMessagesUtk
  });
  return {
    messagesUtk,
    hubspotUtk,
    hstc,
    hssc,
    globalCookieOptOut,
    isFirstVisitorSession
  };
};

exports.prepareVisitorIdentifiers = prepareVisitorIdentifiers;