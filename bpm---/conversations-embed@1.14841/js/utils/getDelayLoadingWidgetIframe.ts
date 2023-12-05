"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDelayLoadingWidgetIframe = void 0;

const getDelayLoadingWidgetIframe = (widgetData, mobile) => {
  const {
    message
  } = widgetData;
  const {
    popOpenWelcomeMessage,
    popOpenWidget,
    popMessageOnSmallScreens,
    clientTriggers
  } = message;
  const {
    displayOnTimeDelay
  } = clientTriggers;
  const {
    enabled,
    timeDelaySeconds
  } = displayOnTimeDelay;
  const timeDelay = timeDelaySeconds * 1000;

  if (mobile) {
    return {
      shouldDelayLoadingIframe: !popMessageOnSmallScreens && enabled && // This additional override allows you to disable the delay in showing the mobile launcher
      !window.ONLY_53_DISPLAY_LAUNCHER_ON_MOBILE,
      timeDelay
    };
  }

  return {
    shouldDelayLoadingIframe: !popOpenWidget && !popOpenWelcomeMessage && enabled,
    timeDelay
  };
};

exports.getDelayLoadingWidgetIframe = getDelayLoadingWidgetIframe;