"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markStartPreDelay = markStartPreDelay;
exports.markStartPostDelay = markStartPostDelay;

var _constants = require("./constants");

function markStartPreDelay() {
  try {
    performance.mark(_constants.START_MARK_PRE_DELAY);
  } catch (e) {//
  }
}

function markStartPostDelay() {
  try {
    performance.mark(_constants.START_MARK_POST_DELAY);
  } catch (e) {//
  }
}