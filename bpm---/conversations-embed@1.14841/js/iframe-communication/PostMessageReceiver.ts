"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostMessageReceiver = void 0;

var _stringInvariant = require("../invariants/stringInvariant");

var _objectInvariant = require("../invariants/objectInvariant");

/** Class that registers and invokes handlers for "message" events */
class PostMessageReceiver {
  /**
   * Create a post message handler
   * @param {Object} messageHandlers  - map of MessageEvent types to handlers
   * @param {Object} options - object to configure the handler at instantiation time
   * @param {string} options.allowedOrigin  - The only origin from which to accept message events
   * @param {string} options.iframeUuid - A uuid of the iframe that the embed script has rendered. This receiver
   *                                      will only handle messages that contain a matching uuid
   */
  constructor(messageHandlers, {
    allowedOrigin,
    iframeUuid
  }) {
    (0, _objectInvariant.objectInvariant)(messageHandlers);
    (0, _stringInvariant.stringInvariant)(allowedOrigin);
    (0, _stringInvariant.stringInvariant)(iframeUuid);
    this.allowedOrigin = allowedOrigin;
    this.iframeUuid = iframeUuid;
    this._handlers = messageHandlers;
    this.handleMessage = this.handleMessage.bind(this);
    window.addEventListener('message', this.handleMessage);
  }
  /**
   * Determines whether a particular origin is allowed for incoming post message events
   * @param {string} origin - the origin to check
   * @return {boolean} Whether the origin is allowed or not
   */


  isOriginAllowed(origin) {
    return origin === this.allowedOrigin;
  }
  /**
   * Handles a message event
   * @param {MessageEvent} messageEvent - The message event to be handled
   */


  handleMessage(messageEvent) {
    const {
      data: rawData,
      origin,
      source
    } = messageEvent;

    if (!this.isOriginAllowed(origin)) {
      return;
    }

    try {
      const parsedData = JSON.parse(rawData);

      if (parsedData.uuid !== this.iframeUuid) {
        return;
      }

      const {
        type,
        data
      } = parsedData;
      const handler = this._handlers[type];

      if (typeof handler === 'function') {
        handler({
          data,
          source
        });
      }
    } catch (e) {
      return;
    }
  }

  register(type, method) {
    this._handlers[type] = method;
  }

}

exports.PostMessageReceiver = PostMessageReceiver;