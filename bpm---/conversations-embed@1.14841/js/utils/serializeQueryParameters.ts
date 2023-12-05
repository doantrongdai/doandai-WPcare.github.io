"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeQueryParameters = exports.withValuesConvertedToString = void 0;

const withValuesConvertedToString = params => {
  return Object.keys(params).map(key => {
    return [key, `${params[key]}`];
  });
};

exports.withValuesConvertedToString = withValuesConvertedToString;

const serializeQueryParameters = params => // eslint-disable-next-line compat/compat
new URLSearchParams(withValuesConvertedToString(params)).toString();

exports.serializeQueryParameters = serializeQueryParameters;