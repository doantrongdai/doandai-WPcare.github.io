"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWidgetDataResponseType = getWidgetDataResponseType;
const TYPE = '@type';

function getWidgetDataResponseType(widgetData) {
  return widgetData && typeof widgetData === 'object' ? widgetData[TYPE] : undefined;
}