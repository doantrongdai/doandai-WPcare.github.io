"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendWidgetDataToIframe = void 0;

var _throttleInProductInitialMessagePopups = require("../utils/throttleInProductInitialMessagePopups");

var _getExternalApiSettings = require("../external-api/getExternalApiSettings");

var _getIframeQueryParams = require("../utils/getIframeQueryParams");

var _sentPostMessageTypes = require("../iframe-communication/constants/sentPostMessageTypes");

const sendWidgetDataToIframe = ({
  source,
  widgetData,
  embedScriptContext,
  apiUsageTracker
}) => {
  source.postMessage(JSON.stringify({
    type: _sentPostMessageTypes.WIDGET_DATA,
    data: Object.assign({}, widgetData, {}, (0, _getIframeQueryParams.getIframeQueryParams)(embedScriptContext))
  }), '*');
  (0, _throttleInProductInitialMessagePopups.throttleInProductInitialMessagePopups)(embedScriptContext);
  apiUsageTracker.trackSettingsUsed((0, _getExternalApiSettings.getExternalApiSettings)());
};

exports.sendWidgetDataToIframe = sendWidgetDataToIframe;