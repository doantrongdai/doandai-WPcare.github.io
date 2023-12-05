"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCmsScriptLoaderPath = void 0;

var _buildCmsScriptLoaderSrc = require("./buildCmsScriptLoaderSrc");

const buildCmsScriptLoaderPath = ({
  portalId
}) => {
  const scriptSrc = (0, _buildCmsScriptLoaderSrc.buildCmsScriptLoaderSrc)({
    portalId
  });
  return `${document.location.origin}${scriptSrc}`;
};

exports.buildCmsScriptLoaderPath = buildCmsScriptLoaderPath;