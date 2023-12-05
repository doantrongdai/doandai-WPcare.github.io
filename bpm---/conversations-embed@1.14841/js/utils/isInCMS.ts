"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInCMS = void 0;

const isInCMS = () => window.hsVars !== undefined;

exports.isInCMS = isInCMS;