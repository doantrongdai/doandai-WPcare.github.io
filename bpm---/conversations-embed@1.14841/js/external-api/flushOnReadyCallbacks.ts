"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flushOnReadyCallbacks = flushOnReadyCallbacks;

var _constants = require("./constants");

function flushOnReadyCallbacks(_ref) {
  let {
    logger,
    trackCallback
  } = _ref;
  // @ts-expect-error Accessing global variable
  const callbacks = window[_constants.ON_READY_CALLBACKS];

  if (Array.isArray(callbacks)) {
    if (trackCallback) trackCallback();
    callbacks.forEach(cb => {
      try {
        cb();
      } catch (err) {
        if (err instanceof Error) {
          logger.error(err.message);
        }
      }
    });
  }
}