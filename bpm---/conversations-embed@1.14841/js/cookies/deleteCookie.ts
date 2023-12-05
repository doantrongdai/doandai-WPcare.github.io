"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCookie = deleteCookie;

var _operators = require("./operators");

function deleteCookie(name) {
  (0, _operators.setCookie)(name, '', -1);
}