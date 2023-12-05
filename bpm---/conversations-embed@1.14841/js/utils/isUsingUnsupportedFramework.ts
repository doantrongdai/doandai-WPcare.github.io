"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUsingUnsupportedFramework = void 0;

var _unsupportedFramework = require("../constants/unsupportedFramework");

const isUsingUnsupportedFramework = () => {
  // Check methods that are added/overwritten by frameworks
  // these methods cause issues that do not allow allow the visitor UI to render
  const overriddenMethods = _unsupportedFramework.METHODS.filter(method => !!method).length;

  return Boolean(overriddenMethods);
};

exports.isUsingUnsupportedFramework = isUsingUnsupportedFramework;