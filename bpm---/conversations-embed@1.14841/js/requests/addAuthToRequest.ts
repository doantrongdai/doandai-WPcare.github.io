"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAuthToRequest = exports.addCsrfHeader = void 0;

var _operators = require("../cookies/operators");

var _constants = require("../cookies/constants");

const addCsrfHeader = xhr => {
  xhr.setRequestHeader('X-HubSpot-CSRF-hubspotapi', (0, _operators.getCookie)(_constants.cookies.HUBSPOT_API_CSRF));
};

exports.addCsrfHeader = addCsrfHeader;

const addAuthToRequest = xhr => {
  addCsrfHeader(xhr);
  xhr.withCredentials = true;
};

exports.addAuthToRequest = addAuthToRequest;