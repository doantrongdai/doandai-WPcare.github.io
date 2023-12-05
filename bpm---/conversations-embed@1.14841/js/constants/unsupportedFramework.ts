"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.METHODS = void 0;
const METHODS = [// @ts-expect-error checking for prototype
Object.prototype.toJSON, // @ts-expect-error checking for prototype
Array.prototype.toJSON, // @ts-expect-error checking for prototype
String.prototype.toJSON];
exports.METHODS = METHODS;