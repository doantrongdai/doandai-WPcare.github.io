"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resizeWidgetIframe = void 0;

var _elementSelectors = require("../constants/elementSelectors");

var _whichDevice = require("./whichDevice");

const resizeWidgetIframe = ({
  height,
  width,
  isOpen
}) => {
  const parent = document.getElementById(_elementSelectors.PARENT_ID);

  if ((0, _whichDevice.isAnyMobile)() && isOpen && parent) {
    parent.style.width = '100%';
    parent.style.height = '100%';
  } else if (height && width && parent) {
    parent.style.width = `${width}px`;
    parent.style.height = `${height}px`;
  }
};

exports.resizeWidgetIframe = resizeWidgetIframe;