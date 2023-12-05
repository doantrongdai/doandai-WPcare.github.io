"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBodyScrollTop = void 0;

const getBodyScrollTop = () => {
  return document.body.scrollTop || document.documentElement.scrollTop;
};

exports.getBodyScrollTop = getBodyScrollTop;