"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWidgetData = fetchWidgetData;
exports.EXPECTED_WIDGET_WILL_NOT_LOAD_CODES = exports.WIDGET_WILL_LOAD_CODES = void 0;

var _isEmbeddedInProduct = require("../utils/isEmbeddedInProduct");

var _addAuthToRequest = require("./addAuthToRequest");

/* eslint-disable no-console */
const MESSAGES_URI_HEADER = 'X-HubSpot-Messages-Uri';
const XHR_DONE_STATE = 4;
const WIDGET_WILL_LOAD_CODES = [200, 304];
exports.WIDGET_WILL_LOAD_CODES = WIDGET_WILL_LOAD_CODES;
const EXPECTED_WIDGET_WILL_NOT_LOAD_CODES = [204, 404];
exports.EXPECTED_WIDGET_WILL_NOT_LOAD_CODES = EXPECTED_WIDGET_WILL_NOT_LOAD_CODES;

const shouldLoad = statusCode => WIDGET_WILL_LOAD_CODES.indexOf(statusCode) > -1;

const requestFailed = statusCode => !shouldLoad(statusCode) && EXPECTED_WIDGET_WILL_NOT_LOAD_CODES.indexOf(statusCode) < 0;

const noop = () => {};
/**
 *
 * @param {object} options
 * @param {string} options.requestUrl
 * @param {number} options.portalId
 * @param {function} loadCallback
 * @param {function} [noopCallback=noop]
 */


function fetchWidgetData({
  requestUrl,
  portalId
}, loadCallback, noopCallback = noop) {
  const request = new XMLHttpRequest();
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== XHR_DONE_STATE) {
      return;
    }

    if (shouldLoad(request.status)) {
      try {
        const json = JSON.parse(request.responseText);
        loadCallback(json);
      } catch (e) {
        console.warn('Initial messages API response is invalid');
        noopCallback();
      }

      return;
    }

    if (requestFailed(request.status)) {
      console.warn('Initial messages API call failed');
    }

    noopCallback();
  });
  request.open('GET', requestUrl); //if embed script is in an iframe then window.href returns about:srcdoc
  //if so targeting will break so grab the top level href instead

  const href = window.location.href === 'about:srcdoc' ? // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
  window.top.location.href : window.location.href;
  request.setRequestHeader(MESSAGES_URI_HEADER, href);

  if ((0, _isEmbeddedInProduct.isEmbeddedInProduct)({
    portalId
  })) {
    (0, _addAuthToRequest.addAuthToRequest)(request);
  }

  request.send();
}