"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cookieValues = exports.cookies = void 0;
const cookies = {
  HUBSPOT: 'hubspotutk',
  MESSAGES: 'messagesUtk',
  IS_OPEN: 'hs-messages-is-open',
  HIDE_WELCOME_MESSAGE: 'hs-messages-hide-welcome-message',
  WIDGET_POSITION: 'hs-messages-widget-position',
  HUBSPOT_API_CSRF: 'hubspotapi-csrf',
  HSTC: '__hstc',
  HSSC: '__hssc',
  GLOBAL_COOKIE_OPT_OUT: '__hs_opt_out'
};
exports.cookies = cookies;
const cookieValues = {
  GLOBAL_COOKIE_OPT_OUT_YES: 'yes',
  GLOBAL_COOKIE_OPT_OUT_NO: 'no'
};
exports.cookieValues = cookieValues;