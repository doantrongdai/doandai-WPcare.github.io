"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHashChangeListener = void 0;

var _urlHasHsChatHashLink = require("../utils/urlHasHsChatHashLink");

const registerHashChangeListener = ({
  requestWidgetOpen,
  isOpen
}) => {
  window.addEventListener('hashchange', () => {
    if ((0, _urlHasHsChatHashLink.urlHasHsChatHashLink)(window.location.href) && !isOpen) {
      requestWidgetOpen();
    }
  });
};

exports.registerHashChangeListener = registerHashChangeListener;