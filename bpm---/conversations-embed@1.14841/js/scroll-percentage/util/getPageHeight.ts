"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPageHeight = void 0;

const getPageHeight = () => {
  return Math.max(document.body.offsetHeight, document.body.scrollHeight);
};

exports.getPageHeight = getPageHeight;