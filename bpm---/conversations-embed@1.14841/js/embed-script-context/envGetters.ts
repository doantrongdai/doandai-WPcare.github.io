"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScriptEnvParams = getScriptEnvParams;
exports.getIsLocal = exports.getMessagesHublet = exports.getMessagesEnv = exports.getPortalId = void 0;

const getPortalId = () => {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return parseInt(scriptElement.getAttribute('data-hsjs-portal'), 10);
};

exports.getPortalId = getPortalId;

const getMessagesEnv = () => {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return scriptElement.getAttribute('data-hsjs-env');
};

exports.getMessagesEnv = getMessagesEnv;

const getMessagesHublet = () => {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return scriptElement.getAttribute('data-hsjs-hublet');
};

exports.getMessagesHublet = getMessagesHublet;

const getIsLocal = () => {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return scriptElement.getAttribute('data-hsjs-local') === 'true';
};

exports.getIsLocal = getIsLocal;

function getScriptEnvParams() {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return {
    ungatedFor: scriptElement.getAttribute('ungated-for'),
    portalId: getPortalId(),
    messagesEnv: getMessagesEnv(),
    messagesHublet: getMessagesHublet(),
    isLocal: getIsLocal()
  };
}