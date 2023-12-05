"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeAllIframeMessageQueueEvents = void 0;

var _postMessageToIframe = require("./postMessageToIframe");

const executeAllIframeMessageQueueEvents = ({
  iframe,
  iframeSrc,
  eventQueue
}) => {
  do {
    const event = eventQueue.dequeue();

    if (event) {
      const {
        type,
        data
      } = event;
      (0, _postMessageToIframe.postMessageToIframe)({
        iframe,
        iframeSrc,
        type,
        data
      });
    }
  } while (eventQueue.peek() && Object.keys(eventQueue.peek()).length !== 0);
};

exports.executeAllIframeMessageQueueEvents = executeAllIframeMessageQueueEvents;