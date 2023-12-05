"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chooseMessagesUtk = chooseMessagesUtk;

var _hsGenerator = require("../utils/hsGenerator");

function chooseMessagesUtk({
  existingMessagesUtk
} = {}) {
  let messagesUtk;
  let isFirstVisitorSession = false;

  if (existingMessagesUtk) {
    messagesUtk = existingMessagesUtk;
  } else {
    isFirstVisitorSession = true;
    messagesUtk = (0, _hsGenerator.getUuid)();
  }

  return {
    messagesUtk,
    isFirstVisitorSession
  };
}