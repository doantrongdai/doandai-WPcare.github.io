"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIdentificationToken = exports.getIdentificationEmail = exports.getEnableWidgetCookieBanner = exports.shouldDisableInitialInputFocus = exports.shouldDisableAttachment = exports.shouldEmbedInline = exports.getInlineEmbedSelector = exports.shouldBeFullscreen = exports.shouldLoadImmediately = void 0;

var _getExternalApiSettings = require("./getExternalApiSettings");

const shouldLoadImmediately = () => !!(0, _getExternalApiSettings.getExternalApiSettings)().loadImmediately;

exports.shouldLoadImmediately = shouldLoadImmediately;

const shouldBeFullscreen = () => !!(0, _getExternalApiSettings.getExternalApiSettings)().isFullscreen;

exports.shouldBeFullscreen = shouldBeFullscreen;

const getInlineEmbedSelector = () => (0, _getExternalApiSettings.getExternalApiSettings)().inlineEmbedSelector;

exports.getInlineEmbedSelector = getInlineEmbedSelector;

const shouldEmbedInline = () => !!(0, _getExternalApiSettings.getExternalApiSettings)().inlineEmbedSelector;

exports.shouldEmbedInline = shouldEmbedInline;

const shouldDisableAttachment = () => !!(0, _getExternalApiSettings.getExternalApiSettings)().disableAttachment;

exports.shouldDisableAttachment = shouldDisableAttachment;

const shouldDisableInitialInputFocus = () => !!(0, _getExternalApiSettings.getExternalApiSettings)().disableInitialInputFocus;

exports.shouldDisableInitialInputFocus = shouldDisableInitialInputFocus;

const getEnableWidgetCookieBanner = () => (0, _getExternalApiSettings.getExternalApiSettings)().enableWidgetCookieBanner;

exports.getEnableWidgetCookieBanner = getEnableWidgetCookieBanner;

const getIdentificationEmail = () => (0, _getExternalApiSettings.getExternalApiSettings)().identificationEmail;

exports.getIdentificationEmail = getIdentificationEmail;

const getIdentificationToken = () => (0, _getExternalApiSettings.getExternalApiSettings)().identificationToken;

exports.getIdentificationToken = getIdentificationToken;