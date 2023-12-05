"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasRequiredFeatures = hasRequiredFeatures;

function hasRequiredFeatures(window)
/* Window */
{
  const featureDetectors = [typeof window.WeakMap === 'function', typeof window.requestAnimationFrame === 'function', typeof window.URLSearchParams === 'function'];
  return featureDetectors.every(featureDetector => featureDetector);
}