"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTargetingAndDelay = void 0;

var _whichDevice = require("./whichDevice");

var _getWidgetDataResponseType = require("../operators/getWidgetDataResponseType");

var _widgetResponseTypes = require("../constants/widgetResponseTypes");

var _getDelayLoadingWidgetIframe = require("./getDelayLoadingWidgetIframe");

var _events = require("../events");

var _markEnd = require("../perf/markEnd");

var _markStart = require("../perf/markStart");

const handleTargetingAndDelay = (setWidgetData, loadIFrame, setWidgetNotLoaded) => {
  return widgetData => {
    const hideWidget = (0, _getWidgetDataResponseType.getWidgetDataResponseType)(widgetData) === _widgetResponseTypes.HIDE_WIDGET;

    const initialize = !hideWidget && !!widgetData.sessionId;

    if (initialize) {
      const {
        shouldDelayLoadingIframe,
        timeDelay
      } = (0, _getDelayLoadingWidgetIframe.getDelayLoadingWidgetIframe)(widgetData, (0, _whichDevice.isAnyMobile)());
      (0, _markEnd.markEndPreDelay)();

      if (shouldDelayLoadingIframe) {
        setTimeout(() => {
          setWidgetData(widgetData);
          (0, _markStart.markStartPostDelay)();
          loadIFrame();
        }, timeDelay);
      } else {
        setWidgetData(widgetData);
        (0, _markStart.markStartPostDelay)();
        loadIFrame();
      }
    } else {
      setWidgetNotLoaded();
    }

    _events.EVENTS.messagesInitialized({
      messageWillRender: initialize
    });
  };
};

exports.handleTargetingAndDelay = handleTargetingAndDelay;