"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadWidgetCss = loadWidgetCss;

/* eslint-disable */
// A snippet of JS that includes the css contents on the page in a <style> tag, rather than having to include a separate css include alongside the JS

/**
 *
 * @param {Document} doc
 */
function loadWidgetCss(doc) {
  const styleContent = require('raw-loader!../../sass/messagesWidgetShell.sass');

  const styleTag = doc.createElement('style');
  styleTag.setAttribute('type', 'text/css');
  const textTag = document.createTextNode(styleContent);
  styleTag.appendChild(textTag);
  doc.head.appendChild(styleTag);
}