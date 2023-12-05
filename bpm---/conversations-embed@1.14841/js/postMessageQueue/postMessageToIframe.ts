"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postMessageToIframe = void 0;

const postMessageToIframe = ({
  iframe,
  iframeSrc,
  type,
  data
}) => {
  iframe.contentWindow.postMessage(JSON.stringify({
    type,
    data
  }), iframeSrc);
};

exports.postMessageToIframe = postMessageToIframe;