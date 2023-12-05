"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiDomain = getApiDomain;

function getApiDomain(messagesEnv, messagesHublet) {
  const envString = messagesEnv === 'qa' ? 'qa' : '';
  const hubletString = messagesHublet === 'na1' || !messagesHublet ? '' : `-${messagesHublet}`;
  return `https://api${hubletString}.hubspot${envString}.com`;
}