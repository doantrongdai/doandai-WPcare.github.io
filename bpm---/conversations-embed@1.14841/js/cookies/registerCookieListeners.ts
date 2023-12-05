"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCookieListeners = void 0;

var _sentPostMessageTypes = require("../iframe-communication/constants/sentPostMessageTypes");

var _constants = require("./constants");

var _deleteCookie = require("./deleteCookie");

const registerCookieListeners = ({
  postMessageToIframe
}) => {
  const handlePrivacyConsent = consent => {
    const allowedMessagesUtkCookie = consent.categories ? consent.categories.functionality : consent.allowed;
    const globalCookieOptOut = allowedMessagesUtkCookie ? _constants.cookieValues.GLOBAL_COOKIE_OPT_OUT_NO : _constants.cookieValues.GLOBAL_COOKIE_OPT_OUT_YES;
    postMessageToIframe(_sentPostMessageTypes.GLOBAL_COOKIE_OPT_OUT, {
      globalCookieOptOut
    });

    if (!allowedMessagesUtkCookie) {
      (0, _deleteCookie.deleteCookie)(_constants.cookies.MESSAGES);
    }
  }; // https://git.hubteam.com/hubSpot/analytics_js#available-callbacks
  // @ts-expect-error Accessing Window


  window._hsq = window._hsq || []; // @ts-expect-error Accessing Window

  window._hsq.push(['addPrivacyConsentListener', handlePrivacyConsent]); // @ts-expect-error Accessing Window


  window._hsq.push(['addUserTokenListener', utk => postMessageToIframe(_sentPostMessageTypes.HUBSPOT_UTK, {
    utk
  })]);
};

exports.registerCookieListeners = registerCookieListeners;