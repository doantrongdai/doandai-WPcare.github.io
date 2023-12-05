"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setClassInClassList = void 0;

var _widgetLocation = require("../constants/widgetLocation");

var _widgetClassNames = require("../constants/widgetClassNames");

const classNames = {
  [_widgetLocation.LEFT_ALIGNED]: _widgetClassNames.ALIGNED_LEFT_CLASS,
  [_widgetLocation.RIGHT_ALIGNED]: _widgetClassNames.ALIGNED_RIGHT_CLASS
};

const setClassInClassList = ({
  widgetLocation,
  classList
}) => {
  const widgetLocationClass = classNames[widgetLocation];

  if (!classList.contains(widgetLocationClass)) {
    const otherLocations = Object.keys(classNames).filter(className => className !== widgetLocation);
    otherLocations.forEach(location => {
      classList.remove(location);
    });
    classList.add(widgetLocationClass);
  }
};

exports.setClassInClassList = setClassInClassList;