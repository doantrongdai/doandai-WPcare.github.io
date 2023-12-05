"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToBoolean = void 0;

const stringToBoolean = stringValue => {
  if (stringValue === 'true') {
    return true;
  }

  return false;
};

exports.stringToBoolean = stringToBoolean;