"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stringInvariant = require("../invariants/stringInvariant");

var _pageTitleNotificationsConstants = require("./constants/pageTitleNotificationsConstants");

/** Class that responds to message events by updating the document's title */
class PageTitleNotificationsPlugin {
  /**
   * Create a page title manager
   * @param {Object} config - object to configure the manager at instantiation time
   * @param {PostMessageHandler} config.postMessageHandler - post message handler with which handlers will be registered
   */
  constructor() {
    this.handleShow = this.handleShow.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.notificationIntervalId = 0;
    this.notificationMessageIsInPageTitle = false;
    this.cachedOriginalDocumentTitle = '';
  }
  /**
   * Clear the existing interval for the notification animation
   */


  clearNotificationInterval() {
    clearInterval(this.notificationIntervalId);
  }
  /**
   * @return {boolean} - whether or not a notification is currently running
   */


  notificationIntervalIsRunning() {
    return Boolean(this.notificationIntervalId);
  }
  /**
   * Start the timing sequence for a page title notification
   * @param {Object} data
   * @param {string} title - the custom notification to show in the page title
   */


  start({
    title
  }) {
    if (this.notificationIntervalIsRunning()) {
      return;
    }

    this.cachedOriginalDocumentTitle = document.title;
    this.togglePageTitle({
      notificationTitle: title
    });
    this.notificationIntervalId = setInterval(() => {
      this.togglePageTitle({
        notificationTitle: title
      });
    }, _pageTitleNotificationsConstants.NOTIFICATION_INTERVAL_MS);
  }
  /**
   * Stop the current timing sequence for a page title notification
   */


  stop() {
    this.clearNotificationInterval();
    this.updatePageTitle(this.cachedOriginalDocumentTitle);
    this.notificationIntervalId = 0;
    this.notificationMessageIsInPageTitle = false;
    this.cachedOriginalDocumentTitle = '';
  }
  /**
   * Switch the page title between its original value and the notification text
   * @param {Object} data
   * @param {string} data.notificationTitle - the custom notification text to show in the page title
   */


  togglePageTitle({
    notificationTitle
  }) {
    if (this.notificationMessageIsInPageTitle) {
      this.updatePageTitle(this.cachedOriginalDocumentTitle);
      this.notificationMessageIsInPageTitle = false;
    } else {
      this.updatePageTitle(notificationTitle);
      this.notificationMessageIsInPageTitle = true;
    }
  }
  /**
   * Handle a SHOW_PAGE_TITLE_NOTIFICATION message event
   * @param {Object} messageEvent - An object with parsed messageEvent event data
   * @param {Object} messageEvent.data - An object with data about the parsed message event
   */


  handleShow({
    data
  }) {
    this.start({
      title: data.title
    });
  }
  /**
   * Handle a CLEAR_PAGE_TITLE_NOTIFICATION message event
   */


  handleClear() {
    this.stop();
  }
  /**
   * Update the html document title
   * @param {string} title - The value to which the document title should be set
   */


  updatePageTitle(title) {
    (0, _stringInvariant.stringInvariant)(title);
    document.title = title;
  }

}

var _default = PageTitleNotificationsPlugin;
exports.default = _default;
module.exports = exports.default;