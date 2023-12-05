"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEmbeddedInProduct = isEmbeddedInProduct;
const PORTAL_53 = 53;
const BET_PORTAL_53 = 99535353;
const QA_PRICING_PAGE_PORTAL = 100048175;
const IN_APP_PATTERN = /^(?:app|local)\.hubspot(?:qa)?\.com$/;
const IN_APP_PRICING_PAGE_PATTERN = /(?:pricing)\/[0-9]+/;
const SIGNUP_PAGE_PATTERN = /signup-hubspot/;
const PRICING_SUBSTRING = 'pricing';

function isEmbeddedInProduct({
  portalId,
  hostname = window.location.hostname,
  pathname = window.location.pathname
}) {
  const isPublicPricingPage = pathname.indexOf(PRICING_SUBSTRING) !== -1 && !IN_APP_PRICING_PAGE_PATTERN.test(pathname);
  const isSignupPage = SIGNUP_PAGE_PATTERN.test(pathname);
  const isInAppPage = IN_APP_PATTERN.test(hostname);

  if (isInAppPage && !isPublicPricingPage && !isSignupPage) {
    if (hostname.indexOf('qa') !== -1) {
      return portalId === PORTAL_53 || portalId === BET_PORTAL_53 || portalId === QA_PRICING_PAGE_PORTAL;
    }

    return portalId === PORTAL_53;
  }

  return false;
}