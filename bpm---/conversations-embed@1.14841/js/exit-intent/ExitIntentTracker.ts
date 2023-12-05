"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _receivedPostMessageTypes = require("../iframe-communication/constants/receivedPostMessageTypes");

class ExitIntentTracker {
  constructor({
    onExitIntent
  }) {
    this._onExitIntent = onExitIntent;
    this._handleMouseOut = this._handleMouseOut.bind(this);
    this._isExitIntent = this._isExitIntent.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }
  /*
   * Inspired by lead-flows-js
   * https://git.hubteam.com/HubSpot/lead-flows-js/blob/33a0e9707336a2cd168c2d40084073d9619e077d/static/coffee/dynos/dyno_binder.coffee#L177-L184
   */


  _isExitIntent(e) {
    if (!e) {
      return false;
    }

    const fromEl = e.relatedTarget || e.toElement;

    if (!fromEl || fromEl.nodeName === 'HTML') {
      if (e.clientY < 100) {
        return true;
      }
    }

    return false;
  }

  _handleMouseOut(e) {
    if (this._isExitIntent(e)) {
      this._onExitIntent();
    }
  }

  _add() {
    window.document.addEventListener('mouseout', this._handleMouseOut);
  }

  add() {
    this.remove();

    this._add();
  }

  remove() {
    window.document.removeEventListener('mouseout', this._handleMouseOut);
  }

  addExitIntentTracker() {
    this.add();
  }

  removeExitIntentTracker() {
    this.remove();
  }

  registerPostMessageReceivers(postMessageReceiver) {
    postMessageReceiver.register(_receivedPostMessageTypes.START_TRACK_EXIT_INTENT, this.add);
    postMessageReceiver.register(_receivedPostMessageTypes.STOP_TRACK_EXIT_INTENT, this.remove);
  }

}

var _default = ExitIntentTracker;
exports.default = _default;
module.exports = exports.default;