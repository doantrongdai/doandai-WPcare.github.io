"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttle = throttle;

function throttle(func, timeout) {
  let throttled = false;
  let trailingCall = null;
  return (...args) => {
    if (throttled) {
      trailingCall = () => {
        func(...args);
      };

      return;
    } else {
      throttled = true;
      func(...args);
      setTimeout(() => {
        throttled = false;

        if (typeof trailingCall === 'function') {
          trailingCall();
        }

        trailingCall = null;
      }, timeout);
    }
  };
}