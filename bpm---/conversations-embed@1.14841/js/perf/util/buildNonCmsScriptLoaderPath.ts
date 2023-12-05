"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNonCmsScriptLoaderPath = void 0;

const buildNonCmsScriptLoaderPath = ({
  env = '',
  portalId
}) => {
  return `${document.location.protocol}//js.hs-scripts${env}.com/${portalId}.js`;
};

exports.buildNonCmsScriptLoaderPath = buildNonCmsScriptLoaderPath;