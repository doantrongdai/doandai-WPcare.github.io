"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupExternalApi = setupExternalApi;

var _constants = require("./constants");

/**
 * Exposes a global variable containing methods used for interacting with the
 * visitor widget
 *
 * @param {object}   externalApi
 * @param {function} externalApi.debug
 * @param {function} externalApi.on
 * @param {function} externalApi.off
 * @param {function} externalApi.clear
 *
 * @param {object}   externalApi.widget
 * @param {function} externalApi.widget.load
 * @param {function} externalApi.widget.remove
 * @param {function} externalApi.widget.open
 * @param {function} externalApi.widget.close
 * @param {function} externalApi.widget.refresh
 * @param {function} externalApi.widget.status
 */
function setupExternalApi(externalApi)
/* TODO: Better Type */
{
  // @ts-expect-error Accessing global variable
  window[_constants.GLOBAL_VARIABLE] = externalApi;
}