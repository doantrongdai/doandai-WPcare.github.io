"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPortalIdFromPath = getPortalIdFromPath;
// stolen from portalIdParser
const pathRegex = /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/;

function getPortalIdFromPath(path) {
  try {
    return pathRegex.exec(path)[1];
  } catch (e) {
    return '';
  }
}