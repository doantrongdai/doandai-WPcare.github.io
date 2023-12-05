"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInternalRequestUrl = getInternalRequestUrl;
exports.getCMSRequestUrl = getCMSRequestUrl;
exports.getPublicRequestUrl = getPublicRequestUrl;

var _legacyHubspotBenderContext = require("legacy-hubspot-bender-context");

var _getApiDomain = require("../utils/getApiDomain");

var _getPortalIdFromPath = require("../utils/getPortalIdFromPath");

var _whichDevice = require("../utils/whichDevice");

//@ts-expect-error untyped-file
// import-eslint-disable-line
function getInternalRequestUrl({
  messagesEnv,
  portalId,
  messagesUtk,
  messagesHublet
}) {
  const usersPortalId = (0, _getPortalIdFromPath.getPortalIdFromPath)(window.location.pathname);
  return `${(0, _getApiDomain.getApiDomain)(messagesEnv, messagesHublet)}/livechat/v1/message/public/hubspot-app?portalId=${usersPortalId}&mobile=${(0, _whichDevice.isAnyMobile)()}&embeddedPortalId=${portalId}&traceId=${messagesUtk}`;
}

function buildRequestParams({
  messagesUtk,
  hubspotUtk,
  portalId,
  referrer,
  hstc,
  hssc,
  email,
  identificationToken
}) {
  let requestUrl = `?portalId=${portalId}&${_legacyHubspotBenderContext.bender.project}=${_legacyHubspotBenderContext.bender.depVersions[_legacyHubspotBenderContext.bender.project]}&mobile=${(0, _whichDevice.isAnyMobile)()}`;

  if (messagesUtk) {
    requestUrl = `${requestUrl}&messagesUtk=${messagesUtk}&traceId=${messagesUtk}`;
  }

  if (hubspotUtk) {
    requestUrl = `${requestUrl}&hubspotUtk=${hubspotUtk}`;
  }

  if (hstc) {
    requestUrl = `${requestUrl}&__hstc=${hstc}`;
  }

  if (hssc) {
    requestUrl = `${requestUrl}&__hssc=${hssc}`;
  }

  if (referrer) {
    requestUrl = `${requestUrl}&referrer=${referrer}`;
  }

  if (identificationToken) {
    requestUrl = `${requestUrl}&identificationToken=${identificationToken}`;
  }

  if (email) {
    requestUrl = `${requestUrl}&email=${email}`;
  }

  return requestUrl;
}

function getCMSRequestUrl({
  messagesUtk,
  hubspotUtk,
  portalId,
  referrer,
  hstc,
  hssc,
  email,
  identificationToken
}) {
  const requestParams = buildRequestParams({
    messagesUtk,
    hubspotUtk,
    portalId,
    referrer,
    hstc,
    hssc,
    email,
    identificationToken
  });
  return `/_hcms/livechat/widget${requestParams}`;
}

function getPublicRequestUrl({
  messagesHublet,
  messagesEnv,
  messagesUtk,
  hubspotUtk,
  portalId,
  referrer,
  hstc,
  hssc,
  email,
  identificationToken
}) {
  const domain = (0, _getApiDomain.getApiDomain)(messagesEnv, messagesHublet);
  const requestParams = buildRequestParams({
    messagesUtk,
    hubspotUtk,
    portalId,
    referrer,
    hstc,
    hssc,
    email,
    identificationToken
  });
  return `${domain}/livechat-public/v1/message/public${requestParams}`;
}