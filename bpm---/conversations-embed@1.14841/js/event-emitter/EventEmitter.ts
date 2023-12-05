"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

var _stringInvariant = require("../invariants/stringInvariant");

var _functionInvariant = require("../invariants/functionInvariant");

var _eventEmitterConstants = require("./constants/eventEmitterConstants");

var _eventTypeInvariant = require("./invariants/eventTypeInvariant");

// @ts-expect-error Frontend Platform doesn't support importing types from package.json deps
class EventEmitter {
  constructor() {
    this._eventEmitter = new _eventemitter.default();
    this._namespacedEventType = this._namespacedEventType.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.trigger = this.trigger.bind(this);
  }

  _namespacedEventType(rawEventType) {
    return `${_eventEmitterConstants.EVENT_NAMESPACE}:${rawEventType}`;
  }
  /*
   * Proxy of https://nodejs.org/api/events.html#events_emitter_addlistener_eventname_listener
   * @param {string} rawEventType - Name of the event to listen for
   * @param {function} listener - Function to be called when the event is triggered
   */


  on(rawEventType, listener) {
    (0, _stringInvariant.stringInvariant)(rawEventType);
    (0, _functionInvariant.functionInvariant)(listener);

    if (!rawEventType.length) {
      return;
    }

    const eventType = this._namespacedEventType(rawEventType);

    this._eventEmitter.addListener(eventType, listener);
  }
  /*
   * Proxy of https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener
   * @param {string} rawEventType - Name of the event for which the listener will be removed
   * @param {function} listener - The listener to remove
   */


  off(rawEventType, listener) {
    (0, _stringInvariant.stringInvariant)(rawEventType);
    (0, _functionInvariant.functionInvariant)(listener);

    if (!rawEventType.length) {
      return;
    }

    const eventType = this._namespacedEventType(rawEventType);

    this._eventEmitter.removeListener(eventType, listener);
  }
  /*
   * Proxy of https://nodejs.org/api/events.html#events_emitter_emit_eventname_args
   * @param {string} rawEventType - Name of the event to be triggered
   * @param {object} [payload] - Data to be sent with the event
   */


  trigger(rawEventType, payload) {
    (0, _eventTypeInvariant.eventTypeInvariant)(rawEventType);

    const eventType = this._namespacedEventType(rawEventType);

    this._eventEmitter.emit(eventType, payload);
  }

}

var _default = EventEmitter;
exports.default = _default;
module.exports = exports.default;