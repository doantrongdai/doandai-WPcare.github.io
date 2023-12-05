"use strict";

var _startOnceReady = require("./startOnceReady");

var _markStart = require("./perf/markStart");

(0, _markStart.markStartPreDelay)();

const onDOMReady = () => {
  (0, _startOnceReady.startOnceReady)();
  document.removeEventListener('DOMContentLoaded', onDOMReady);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMReady);
} else {
  (0, _startOnceReady.startOnceReady)();
}