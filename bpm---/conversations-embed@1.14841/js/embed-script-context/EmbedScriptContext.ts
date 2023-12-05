"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EmbedScriptContext = void 0;

var _numberInvariant = require("../invariants/numberInvariant");

var _stringInvariant = require("../invariants/stringInvariant");

var _isEmbeddedInProduct = require("../utils/isEmbeddedInProduct");

var _urls = require("../requests/urls");

var _serializeQueryParameters = require("../utils/serializeQueryParameters");

var _getIframeQueryParams = require("../utils/getIframeQueryParams");

var _isInCMS = require("../utils/isInCMS");

var _getPerfAttributes = require("../perf/getPerfAttributes");

var _settingsHelpers = require("../external-api/settingsHelpers");

class EmbedScriptContext {
  constructor(properties) {
    const {
      globalCookieOptOut,
      hubspotUtk,
      hstc,
      hssc,
      iFrameDomainOverride,
      iframeUuid,
      isFirstVisitorSession,
      messagesEnv,
      messagesUtk,
      referrer,
      portalId,
      useLocalBuild,
      identificationEmail,
      identificationToken,
      messagesHublet
    } = properties;
    (0, _stringInvariant.stringInvariant)(iframeUuid, 'iframeUuid');
    (0, _stringInvariant.stringInvariant)(messagesEnv, 'messagesEnv');
    (0, _stringInvariant.stringInvariant)(messagesUtk, 'messagesUtk');
    (0, _numberInvariant.numberInvariant)(portalId, 'portalId');
    this.globalCookieOptOut = globalCookieOptOut;
    this.hubspotUtk = hubspotUtk;
    this.hstc = hstc;
    this.hssc = hssc;
    this.iFrameDomainOverride = iFrameDomainOverride;
    this.iframeUuid = iframeUuid;
    this.isFirstVisitorSession = isFirstVisitorSession;
    this.messagesEnv = messagesEnv;
    this.messagesUtk = messagesUtk;
    this.referrer = referrer;
    this.portalId = portalId;
    this.useLocalBuild = useLocalBuild;
    this.identificationEmail = identificationEmail;
    this.identificationToken = identificationToken;
    this.messagesHublet = messagesHublet;
    this.getIFrameDomain = this.getIFrameDomain.bind(this);
    this.getIFrameSrc = this.getIFrameSrc.bind(this);
    this.getInitialRequestUrl = this.getInitialRequestUrl.bind(this);
  }

  getIFrameDomain() {
    const envString = this.messagesEnv === 'qa' ? 'qa' : '';
    const hubletString = this.messagesHublet === 'na1' || !this.messagesHublet ? '' : `-${this.messagesHublet}`;

    if (this.iFrameDomainOverride) {
      return this.iFrameDomainOverride;
    }

    if (this.useLocalBuild) {
      return `https://local${hubletString}.hubspot${envString}.com`;
    }

    return `https://app${hubletString}.hubspot${envString}.com`;
  }

  getIFrameSrc() {
    const queryParams = (0, _serializeQueryParameters.serializeQueryParameters)((0, _getIframeQueryParams.getIframeQueryParams)({
      messagesUtk: this.messagesUtk,
      hubspotUtk: this.hubspotUtk,
      portalId: this.portalId,
      iframeUuid: this.iframeUuid,
      globalCookieOptOut: this.globalCookieOptOut,
      isFirstVisitorSession: this.isFirstVisitorSession,
      hstc: this.hstc
    }));
    return `${this.getIFrameDomain()}/conversations-visitor/${this.portalId}/threads/utk/${this.messagesUtk}?${queryParams}`;
  }

  getEncodedIdentificationEmail() {
    let visitorEmail = this.identificationEmail;

    if (!visitorEmail.includes('@')) {
      visitorEmail = decodeURIComponent(visitorEmail);
    }

    return encodeURIComponent(visitorEmail);
  }

  getInitialRequestUrl() {
    if ((0, _isInCMS.isInCMS)()) {
      return (0, _urls.getCMSRequestUrl)({
        messagesUtk: this.messagesUtk,
        hubspotUtk: this.hubspotUtk,
        portalId: this.portalId,
        referrer: this.referrer,
        hstc: this.hstc,
        hssc: this.hssc,
        email: this.identificationEmail && this.getEncodedIdentificationEmail(),
        identificationToken: this.identificationToken
      });
    }

    if ((0, _isEmbeddedInProduct.isEmbeddedInProduct)({
      portalId: this.portalId
    })) {
      return (0, _urls.getInternalRequestUrl)({
        messagesHublet: this.messagesHublet,
        messagesEnv: this.messagesEnv,
        messagesUtk: this.messagesUtk,
        portalId: this.portalId
      });
    }

    return (0, _urls.getPublicRequestUrl)({
      messagesHublet: this.messagesHublet,
      messagesEnv: this.messagesEnv,
      messagesUtk: this.messagesUtk,
      hubspotUtk: this.hubspotUtk,
      portalId: this.portalId,
      referrer: this.referrer,
      hstc: this.hstc,
      hssc: this.hssc,
      email: this.identificationEmail && this.getEncodedIdentificationEmail(),
      identificationToken: this.identificationToken
    });
  }

  getPerfAttributes() {
    const perfAttributes = (0, _getPerfAttributes.getPerfAttributes)({
      portalId: this.portalId,
      messagesEnv: this.messagesEnv
    });

    if (!(0, _settingsHelpers.shouldLoadImmediately)() || !perfAttributes) {
      return undefined;
    }

    return perfAttributes;
  }

}

exports.EmbedScriptContext = EmbedScriptContext;
var _default = EmbedScriptContext;
exports.default = _default;