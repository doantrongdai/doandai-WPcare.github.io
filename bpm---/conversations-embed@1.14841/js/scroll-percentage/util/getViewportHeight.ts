"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getViewportHeight = void 0;

const getViewportHeight = () => {
  return Math.max(window.innerHeight || 0, document.documentElement.clientHeight);
};

exports.getViewportHeight = getViewportHeight;