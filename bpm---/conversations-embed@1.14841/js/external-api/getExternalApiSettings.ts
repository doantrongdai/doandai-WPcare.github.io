"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExternalApiSettings = getExternalApiSettings;

var _constants = require("./constants");

var _booleanInvariant = require("../invariants/booleanInvariant");

var _stringInvariant = require("../invariants/stringInvariant");

var _oneOfListInvariant = require("../invariants/oneOfListInvariant");

const defaultSettings = {
  loadImmediately: true,
  isFullscreen: false,
  inlineEmbedSelector: '',
  disableAttachment: false,
  enableWidgetCookieBanner: false,
  identificationEmail: '',
  identificationToken: '',
  disableInitialInputFocus: false
};
/**
 * @returns {object}
 */

function getExternalApiSettings() {
  // @ts-expect-error Accessing global variable
  const customerSettings = window[_constants.SETTINGS_VARIABLE];
  const mergedSettings = Object.assign({}, defaultSettings, customerSettings);
  (0, _booleanInvariant.booleanInvariant)(mergedSettings.loadImmediately, 'mergedSettings.loadImmediately');
  (0, _booleanInvariant.booleanInvariant)(mergedSettings.isFullscreen, 'mergedSettings.isFullscreen');
  (0, _booleanInvariant.booleanInvariant)(mergedSettings.disableAttachment, 'mergedSettings.disableAttachment');
  (0, _booleanInvariant.booleanInvariant)(mergedSettings.disableInitialInputFocus, 'mergedSettings.disableInitialInputFocus');
  (0, _oneOfListInvariant.oneOfListInvariant)(mergedSettings.enableWidgetCookieBanner, 'mergedSettings.enableWidgetCookieBanner', [false, true, _constants.ON_WIDGET_LOAD, _constants.ON_EXIT_INTENT]);
  (0, _stringInvariant.stringInvariant)(mergedSettings.inlineEmbedSelector, 'mergedSettings.inlineEmbedSelector');
  (0, _stringInvariant.stringInvariant)(mergedSettings.identificationEmail, 'mergedSettings.identificationEmail');
  (0, _stringInvariant.stringInvariant)(mergedSettings.identificationToken, 'mergedSettings.identificationToken');
  return mergedSettings;
}