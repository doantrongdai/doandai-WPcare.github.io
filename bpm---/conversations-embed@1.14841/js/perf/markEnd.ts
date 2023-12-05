"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markEndPostDelay = markEndPostDelay;
exports.markEndPreDelay = markEndPreDelay;

var _constants = require("./constants");

function markEndPostDelay() {
  try {
    performance.mark(_constants.END_MARK_POST_DELAY);
  } catch (e) {//
  }
}

function markEndPreDelay() {
  try {
    performance.mark(_constants.END_MARK_PRE_DELAY);
  } catch (e) {//
  }
}