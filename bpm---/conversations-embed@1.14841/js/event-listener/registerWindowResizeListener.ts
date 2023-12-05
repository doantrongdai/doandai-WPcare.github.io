"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerWindowResizeListener = void 0;

const registerWindowResizeListener = ({
  resizeCallbackFn
}) => {
  window.addEventListener('resize', resizeCallbackFn, {
    passive: true
  });
};

exports.registerWindowResizeListener = registerWindowResizeListener;