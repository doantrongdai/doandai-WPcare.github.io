"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHubSpotUtkFromCookie = getHubSpotUtkFromCookie;

var _constants = require("../cookies/constants");

var _operators = require("../cookies/operators");

function getHubSpotUtkFromCookie() {
  return (0, _operators.getCookie)(_constants.cookies.HUBSPOT);
}