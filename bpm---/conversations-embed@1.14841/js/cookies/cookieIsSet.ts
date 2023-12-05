"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cookieIsSet = void 0;

var _operators = require("./operators");

const cookieIsSet = name => {
  return Boolean((0, _operators.getCookie)(name));
};

exports.cookieIsSet = cookieIsSet;