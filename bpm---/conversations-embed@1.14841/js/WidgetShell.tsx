"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetShell = void 0;

var _whichDevice = require("./utils/whichDevice");

var _receivedPostMessageTypes = require("./iframe-communication/constants/receivedPostMessageTypes");

var _sentPostMessageTypes = require("./iframe-communication/constants/sentPostMessageTypes");

var _PostMessageReceiver = require("./iframe-communication/PostMessageReceiver");

var _PageTitleNotificationsPlugin = _interopRequireDefault(require("./page-title-notifications/PageTitleNotificationsPlugin"));

var _getWidgetDataResponseType = require("./operators/getWidgetDataResponseType");

var _operators = require("./cookies/operators");

var _constants = require("./cookies/constants");

var _times = _interopRequireDefault(require("./cookies/times"));

var _clearCookies = require("./cookies/clearCookies");

var _widgetClassNames = require("./constants/widgetClassNames");

var _widgetResponseTypes = require("./constants/widgetResponseTypes");

var _setMessagesUtk = require("./utk/setMessagesUtk");

var _isEmbeddedInProduct = require("./utils/isEmbeddedInProduct");

var _shouldRenderWidget = require("./utils/shouldRenderWidget");

var _shouldWidgetStartOpen = require("./utils/shouldWidgetStartOpen");

var _elementSelectors = require("./constants/elementSelectors");

var _setupExternalApi = require("./external-api/setupExternalApi");

var _flushOnReadyCallbacks = require("./external-api/flushOnReadyCallbacks");

var _DevLogger = _interopRequireDefault(require("./external-api/DevLogger"));

var _EventEmitter = _interopRequireDefault(require("./event-emitter/EventEmitter"));

var _handleExternalApiEventMessage = require("./event-emitter/handleExternalApiEventMessage");

var _fetchWidgetData = require("./requests/fetchWidgetData");

var _events = require("./events");

var _throttle = require("./utils/throttle");

var _getIframeQueryParams = require("./utils/getIframeQueryParams");

var _settingsHelpers = require("./external-api/settingsHelpers");

var _ScrollPercentageTracker = _interopRequireDefault(require("./scroll-percentage/ScrollPercentageTracker"));

var _ExitIntentTracker = _interopRequireDefault(require("./exit-intent/ExitIntentTracker"));

var _markEnd = require("./perf/markEnd");

var _setClassInClassList = require("./operators/setClassInClassList");

var _widgetDataKeys = require("./constants/widgetDataKeys");

var _resetAndLaunchWidget = require("./utk/resetAndLaunchWidget");

var _extendedFunctions = require("./constants/extendedFunctions");

var _ApiUsageTracker = require("./external-api/ApiUsageTracker");

var _PostMessageApiClient = require("./iframe-communication/PostMessageApiClient");

var _sendWidgetDataToIframe = require("./postMessageMethods/sendWidgetDataToIframe");

var _registerCookieListeners = require("./cookies/registerCookieListeners");

var _registerHashChangeListener = require("./event-listener/registerHashChangeListener");

var _registerWindowResizeListener = require("./event-listener/registerWindowResizeListener");

var _iframeMessagePool = require("./postMessageQueue/iframeMessagePool");

var _hideWelcomeMessage = require("./utils/hideWelcomeMessage");

var _resizeWidgetIframe = require("./utils/resizeWidgetIframe");

var _handleTargetingAndDelay = require("./utils/handleTargetingAndDelay");

var _getGlobalCookieOptOut = require("./utk/getGlobalCookieOptOut");

var _gdprCookieConsentTypes = require("conversations-internal-schema/widget-data/constants/gdprCookieConsentTypes");

var _deleteCookie = require("./cookies/deleteCookie");

// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'conv... Remove this comment to see the full error message
const HELP_WIDGET_ID = 'help-widget';

const noop = () => {};

class WidgetShell {
  constructor(embedScriptContext, errorLogger, eventEmitter) {
    this.handleDragStart = e => {
      const parent = document.getElementById(_elementSelectors.PARENT_ID);
      this.isDragging = true;
      const isRightAligned = this.widgetData[_widgetDataKeys.WIDGET_LOCATION] === 'RIGHT_ALIGNED';
      this.offsetX = isRightAligned ? parent.getBoundingClientRect().right - e.clientX : e.clientX - parent.getBoundingClientRect().left;
      this.offsetY = parent.getBoundingClientRect().bottom - e.clientY; // Show Drag Overlay

      if (this.dragOverlayEl instanceof HTMLDivElement) {
        this.dragOverlayEl.style.setProperty('display', 'block');
      }

      if (this.dragHandleEl instanceof HTMLDivElement) {
        this.dragHandleEl.style.setProperty('cursor', 'grabbing');
      }
    };

    this.handleDragEnd = () => {
      if (!this.dragHandleEl) {
        return;
      }

      this.dragHandleEl.style.setProperty('cursor', 'grab');

      if (this.dragOverlayEl instanceof HTMLDivElement) {
        this.dragOverlayEl.style.setProperty('display', 'none');
      }

      this.isDragging = false;
      const isRightAligned = this.widgetData ? this.widgetData[_widgetDataKeys.WIDGET_LOCATION] === 'RIGHT_ALIGNED' : 'RIGHT_ALIGNED';
      const widgetAlignment = isRightAligned ? 'right' : 'left';
      const cookieKey = `${_constants.cookies.WIDGET_POSITION}_${widgetAlignment}`;
      const parentEl = document.getElementById(_elementSelectors.PARENT_ID);
      const style = window.getComputedStyle(parentEl);
      const bottom = parseInt(style.bottom, 10);
      const horizontal = isRightAligned ? parseInt(style.right, 10) : parseInt(style.left, 10);

      if (!horizontal && !bottom) {
        parentEl.style.removeProperty(widgetAlignment);
        parentEl.style.removeProperty('bottom');
        (0, _deleteCookie.deleteCookie)(cookieKey);
      } else {
        (0, _operators.setCookie)(cookieKey, JSON.stringify({
          bottom,
          horizontal
        }), _times.default.THIRTY_MINUTES);
      }
    };

    this.handleDrag = e => {
      if (!this.isDragging) return;
      const parent = document.getElementById(_elementSelectors.PARENT_ID);
      const isRightAligned = this.widgetData ? this.widgetData[_widgetDataKeys.WIDGET_LOCATION] === 'RIGHT_ALIGNED' : 'RIGHT_ALIGNED';
      const widgetAlignment = isRightAligned ? 'right' : 'left';
      const horizontal = isRightAligned ? window.innerWidth - e.clientX - this.offsetX : e.clientX - this.offsetX;
      const bottom = window.innerHeight - e.clientY - this.offsetY;
      parent.style.setProperty(widgetAlignment, `${Math.min(Math.max(0, horizontal), window.innerWidth - parent.clientWidth)}px`, 'important');
      parent.style.setProperty('bottom', `${Math.min(Math.max(0, bottom), window.innerHeight - parent.clientHeight)}px`, 'important');
      parent.style.setProperty('position', 'fixed', '!important');
    };

    this.initalizeDrag = () => {
      const {
        accentColor,
        gates
      } = this.widgetData;

      if (!gates || !gates['Conversations:DraggableChat'] || (0, _whichDevice.isAnyMobile)()) {
        return;
      }

      const widgetAlignment = this.widgetData[_widgetDataKeys.WIDGET_LOCATION] === 'RIGHT_ALIGNED' ? 'right' : 'left'; // Create Drag Handle Element

      this.dragHandleEl = document.createElement('div');
      this.dragHandleEl.innerText = 'Drag';
      this.dragHandleEl.style.setProperty('z-index', '999');
      this.dragHandleEl.style.setProperty('position', 'absolute');
      this.dragHandleEl.style.setProperty('bottom', '16px');
      this.dragHandleEl.style.setProperty(widgetAlignment, `${16 + 60}px`); // Width of Launcher + 8px gap

      this.dragHandleEl.style.setProperty('cursor', 'grab');
      this.dragHandleEl.style.setProperty('height', '60px');
      this.dragHandleEl.style.setProperty('display', 'none');
      this.dragHandleEl.style.setProperty('align-items', 'center');
      this.dragHandleEl.style.setProperty('color', accentColor);
      this.dragHandleEl.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2202_11221)"><path d="M11.1417 0H13.4333C14.0642 0 14.575 0.510833 14.575 1.14167V3.43333C14.575 4.06417 14.0642 4.575 13.4333 4.575H11.1417C10.5108 4.575 10 4.06417 10 3.43333V1.14167C10 0.510833 10.5108 0 11.1417 0ZM11.1417 6.85833H13.4333C14.0642 6.85833 14.575 7.36917 14.575 8V10.2917C14.575 10.9225 14.0642 11.4333 13.4333 11.4333H11.1417C10.5108 11.4333 10 10.9225 10 10.2917V8C10 7.36917 10.5108 6.85833 11.1417 6.85833ZM11.1417 13.7167H13.4333C14.0642 13.7167 14.575 14.2275 14.575 14.8583V17.15C14.575 17.7808 14.0642 18.2917 13.4333 18.2917H11.1417C10.5108 18.2917 10 17.7808 10 17.15V14.8583C10 14.2275 10.5108 13.7167 11.1417 13.7167ZM11.1417 20.575H13.4333C14.0642 20.575 14.575 21.0858 14.575 21.7167V24.0083C14.575 24.6392 14.0642 25.15 13.4333 25.15H11.1417C10.5108 25.15 10 24.6392 10 24.0083V21.7167C10 21.0858 10.5108 20.575 11.1417 20.575ZM18 0H20.2917C20.9225 0 21.4333 0.510833 21.4333 1.14167V3.43333C21.4333 4.06417 20.9225 4.575 20.2917 4.575H18C17.3692 4.575 16.8583 4.06417 16.8583 3.43333V1.14167C16.8583 0.510833 17.3692 0 18 0ZM18 6.85833H20.2917C20.9225 6.85833 21.4333 7.36917 21.4333 8V10.2917C21.4333 10.9225 20.9225 11.4333 20.2917 11.4333H18C17.3692 11.4333 16.8583 10.9225 16.8583 10.2917V8C16.8583 7.36917 17.3692 6.85833 18 6.85833ZM18 13.7167H20.2917C20.9225 13.7167 21.4333 14.2275 21.4333 14.8583V17.15C21.4333 17.7808 20.9225 18.2917 20.2917 18.2917H18C17.3692 18.2917 16.8583 17.7808 16.8583 17.15V14.8583C16.8583 14.2275 17.3692 13.7167 18 13.7167ZM18 20.575H20.2917C20.9225 20.575 21.4333 21.0858 21.4333 21.7167V24.0083C21.4333 24.6392 20.9225 25.15 20.2917 25.15H18C17.3692 25.15 16.8583 24.6392 16.8583 24.0083V21.7167C16.8583 21.0858 17.3692 20.575 18 20.575ZM11.1417 27.425H13.4333C14.0642 27.425 14.575 27.9358 14.575 28.5667V30.8583C14.575 31.4892 14.0642 32 13.4333 32H11.1417C10.5108 32 10 31.4892 10 30.8583V28.5667C10 27.9358 10.5108 27.425 11.1417 27.425ZM18 27.425H20.2917C20.9225 27.425 21.4333 27.9358 21.4333 28.5667V30.8583C21.4333 31.4892 20.9225 32 20.2917 32H18C17.3692 32 16.8583 31.4892 16.8583 30.8583V28.5667C16.8583 27.9358 17.3692 27.425 18 27.425Z" fill="currentColor"></path></g><defs><clipPath id="clip0_2202_11221"><rect width="32" height="32" fill="white"></rect></clipPath></defs></svg>
    `; // Create Drag Overlay Element

      this.dragOverlayEl = document.createElement('div');
      this.dragOverlayEl.style.setProperty('position', 'absolute');
      this.dragOverlayEl.style.setProperty('top', '0');
      this.dragOverlayEl.style.setProperty('left', '0');
      this.dragOverlayEl.style.setProperty('right', '0');
      this.dragOverlayEl.style.setProperty('bottom', '0');
      this.dragOverlayEl.style.setProperty('user-select', 'none');
      this.dragOverlayEl.style.setProperty('z-index', '999');
      this.dragOverlayEl.style.setProperty('display', 'none'); // Add Drag Handle and Overlay to Widget

      const parent = document.getElementById(_elementSelectors.PARENT_ID);
      parent.appendChild(this.dragOverlayEl);
      parent.appendChild(this.dragHandleEl);
      parent.style.setProperty('user-select', 'none'); // Add Event Listeners

      this.dragHandleEl.addEventListener('mousedown', this.handleDragStart);
      window.addEventListener('mousemove', this.handleDrag);
      window.addEventListener('mouseup', this.handleDragEnd);
      window.addEventListener('mouseleave', this.handleDragEnd);
    };

    this.getDefaultSize = () => {
      return {
        width: 100,
        height: 96
      };
    };

    this.getStartPosition = () => {
      if (!this.widgetData.gates || !this.widgetData.gates['Conversations:DraggableChat'] || (0, _whichDevice.isAnyMobile)()) {
        return null;
      }

      const isRightAligned = this.widgetData ? this.widgetData[_widgetDataKeys.WIDGET_LOCATION] === 'RIGHT_ALIGNED' : 'RIGHT_ALIGNED';
      const widgetAlignment = isRightAligned ? 'right' : 'left';
      const cookieKey = `${_constants.cookies.WIDGET_POSITION}_${widgetAlignment}`;
      const cookie = (0, _operators.getCookie)(cookieKey);

      if (cookie) {
        try {
          return JSON.parse(cookie);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Error parsing cookie', e);
          return null;
        }
      } else {
        return null;
      }
    };

    this.loadIFrame = () => {
      if ((0, _whichDevice.isAnyMobile)()) {
        document.documentElement.classList.add(_widgetClassNames.MOBILE);
      }

      const iframe = document.createElement('iframe');
      this.iframeSrc = this.embedScriptContext.getIFrameSrc();
      iframe.src = this.iframeSrc;
      iframe.id = _elementSelectors.IFRAME_ID;
      iframe.role = 'region';
      iframe.ariaLabel = 'Chat Widget';
      iframe.allowFullscreen = true;
      iframe.setAttribute('data-test-id', 'chat-widget-iframe');
      iframe.addEventListener('load', this.handleIframeLoad);
      /**
       * Inline embed
       */

      if ((0, _settingsHelpers.shouldEmbedInline)()) {
        const embedElement = document.querySelector((0, _settingsHelpers.getInlineEmbedSelector)());

        if (!embedElement) {
          this.devLogger.error(`cannot embed widget - element at \`${(0, _settingsHelpers.getInlineEmbedSelector)()}\` cannot be found`);
          return;
        }

        const parent = document.createElement('div');
        parent.id = _elementSelectors.INLINE_PARENT_ID;
        iframe.id = _elementSelectors.INLINE_IFRAME_ID;
        this.iframe = parent.appendChild(iframe);
        embedElement.appendChild(parent);
        return;
      }
      /**
       * Normal embed
       */


      if (document.getElementById(_elementSelectors.PARENT_ID)) {
        // eslint-disable-next-line no-console
        console.warn(`Element with id ${_elementSelectors.PARENT_ID} already exists. Unable to load HubSpot Conversations Widget.`);
        return;
      }

      const parent = document.getElementById(_elementSelectors.PARENT_ID) || document.createElement('div');
      parent.id = _elementSelectors.PARENT_ID;
      const startPosition = this.getStartPosition();

      if (startPosition) {
        const isRightAligned = this.widgetData[_widgetDataKeys.WIDGET_LOCATION] === 'RIGHT_ALIGNED';
        const widgetAlignment = isRightAligned ? 'right' : 'left';
        parent.style.setProperty(widgetAlignment, `${startPosition.horizontal}px`, 'important');
        parent.style.setProperty('bottom', `${startPosition.bottom}px`, 'important');
      }

      const {
        height,
        width
      } = this.getDefaultSize();
      parent.style.minHeight = `${height}px`;
      parent.style.minWidth = `${width}px`;
      const shadowContainer = document.createElement('div');
      shadowContainer.className = _widgetClassNames.SHADOW_CONTAINER;
      const embeddedInProduct = (0, _isEmbeddedInProduct.isEmbeddedInProduct)(this.embedScriptContext);

      if (embeddedInProduct) {
        parent.classList.add(_widgetClassNames.INTERNAL);
        shadowContainer.classList.add(_widgetClassNames.INTERNAL);
      }

      parent.appendChild(shadowContainer);

      if (embeddedInProduct) {
        iframe.id = HELP_WIDGET_ID;
      }

      this.iframe = parent.appendChild(iframe);
      document.body.appendChild(parent);
      this.initalizeDrag();
      this.setFrameClass();
    };

    this.handleI18nLabels = ({
      data
    }) => {
      if (!this.iframe || !data) return;
      const frameLabel = data['conversations-visitor-ui.visitorExperienceAriaLabels.chatWidget'];
      const dragHandleLabel = data['conversations-visitor-experience-components.visitorExperienceAriaLabels.drag'];

      if (frameLabel) {
        this.iframe.ariaLabel = frameLabel;
      }

      if (dragHandleLabel && this.dragHandleEl) {
        this.dragHandleEl.setAttribute('title', dragHandleLabel);
      }
    };

    this.clampPosition = () => {
      const {
        gates
      } = this.widgetData || {}; // Do Not Clamp Position if Draggable Chat is not enabled

      if (!gates || !gates['Conversations:DraggableChat'] || (0, _whichDevice.isAnyMobile)()) {
        return;
      }

      let hasChanged = false;
      const parent = document.getElementById(_elementSelectors.PARENT_ID);
      const isRightAligned = this.widgetData ? this.widgetData[_widgetDataKeys.WIDGET_LOCATION] === 'RIGHT_ALIGNED' : 'RIGHT_ALIGNED';

      if (!parent || !parent.getBoundingClientRect) {
        // Return if parent is not found (or is being used in a test and doesn't have getBoundingClientRect)
        return;
      }

      const {
        top,
        left,
        right,
        bottom
      } = parent.getBoundingClientRect();
      const {
        innerWidth,
        innerHeight
      } = window;
      const adjRight = innerWidth - right;
      const adjBottom = innerHeight - bottom;
      const {
        clientWidth,
        clientHeight
      } = parent;

      if (clientHeight > innerHeight) {
        parent.style.setProperty('bottom', `0px`, 'important');
        hasChanged = true;
      } else if (top < 0) {
        parent.style.setProperty('bottom', `${innerHeight - clientHeight}px`, 'important');
        hasChanged = true;
      } else if (adjBottom < 0) {
        parent.style.setProperty('bottom', `0px`, 'important');
        hasChanged = true;
      }

      if (isRightAligned) {
        if (adjRight < 0) {
          parent.style.setProperty('right', '0px', 'important');
          hasChanged = true;
        }

        if (left < 0) {
          parent.style.setProperty('right', `${innerWidth - clientWidth}px`, 'important');
          hasChanged = true;
        }
      } else {
        // Left Aligned
        if (adjRight < 0) {
          parent.style.setProperty('left', `${innerWidth - clientWidth}px`, 'important');
          hasChanged = true;
        }

        if (left < 0) {
          parent.style.setProperty('left', `0px`, 'important');
          hasChanged = true;
        }
      }

      if (hasChanged) {
        this.handleDragEnd();
      }
    };

    this.setWidgetData = widgetData => {
      this.widgetData = widgetData;
      this.setFrameClass();
    };

    this.embedScriptContext = embedScriptContext; // Drag Functionality

    this.dragHandleEl = null;
    this.dragOverlayEl = null;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isOpen = (0, _shouldWidgetStartOpen.shouldWidgetStartOpen)();
    this.iframe = null;
    this.iframeSrc = null;
    this.hasLoadedIframe = false;
    this.isLoadingIframe = false;
    this.requestWidgetOpen = this.requestWidgetOpen.bind(this);
    this.requestWidgetClose = this.requestWidgetClose.bind(this);
    this.requestWidgetRefresh = (0, _throttle.throttle)(this.requestWidgetRefresh.bind(this), 1000);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleIframeLoad = this.handleIframeLoad.bind(this);
    this.handleResizeMessage = this.handleResizeMessage.bind(this);
    this.handleOpenChange = this.handleOpenChange.bind(this);
    this.handleStoreMessagesCookie = this.handleStoreMessagesCookie.bind(this);
    this.handleRequestWidget = this.handleRequestWidget.bind(this);
    this.handleWidgetRefresh = this.handleWidgetRefresh.bind(this);
    this.setWidgetNotLoaded = this.setWidgetNotLoaded.bind(this);
    this.removeIframe = this.removeIframe.bind(this);
    this.handleExternalApiEventMessage = this.handleExternalApiEventMessage.bind(this);
    this.loadWidget = (0, _throttle.throttle)(this.loadWidget.bind(this), 1000);
    this.resetAndReloadWidget = this.resetAndReloadWidget.bind(this);
    this.setWidgetOpenCookie = this.setWidgetOpenCookie.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleExitIntent = this.handleExitIntent.bind(this);
    this.extendedClearCookiesFunction = this.extendedClearCookiesFunction.bind(this);
    this.openToNewThread = this.openToNewThread.bind(this);
    this.devLogger = new _DevLogger.default();
    this.eventEmitter = eventEmitter || new _EventEmitter.default();
    this.logError = errorLogger ? errorLogger.logError : noop;
    this.scrollPercentageTracker = new _ScrollPercentageTracker.default({
      onScroll: this.handleScroll
    });
    this.exitIntentTracker = new _ExitIntentTracker.default({
      onExitIntent: this.handleExitIntent
    });
    this.iframeMessage = (0, _iframeMessagePool.iframeMessagePool)({
      iframeSrc: this.embedScriptContext.getIFrameSrc()
    });
    this.apiUsageTracker = new _ApiUsageTracker.ApiUsageTracker({
      postMessageToIframe: this.iframeMessage.post
    });
    const postMessageApiClient = new _PostMessageApiClient.PostMessageApiClient(this.iframeMessage.post);
    const pageTitleNotifications = new _PageTitleNotificationsPlugin.default();
    this.postMessageReceiver = new _PostMessageReceiver.PostMessageReceiver({
      [_receivedPostMessageTypes.SHOW_PAGE_TITLE_NOTIFICATION]: pageTitleNotifications.handleShow,
      [_receivedPostMessageTypes.CLEAR_PAGE_TITLE_NOTIFICATION]: pageTitleNotifications.handleClear,
      [_receivedPostMessageTypes.REQUEST_WIDGET]: this.handleRequestWidget,
      [_receivedPostMessageTypes.IFRAME_RESIZE]: this.handleResizeMessage,
      [_receivedPostMessageTypes.OPEN_CHANGE]: this.handleOpenChange,
      [_receivedPostMessageTypes.CLOSED_WELCOME_MESSAGE]: _hideWelcomeMessage.hideWelcomeMessage,
      [_receivedPostMessageTypes.STORE_MESSAGES_COOKIE]: this.handleStoreMessagesCookie,
      [_receivedPostMessageTypes.EXTERNAL_API_EVENT]: this.handleExternalApiEventMessage,
      [_receivedPostMessageTypes.API_REQUEST]: postMessageApiClient.makeApiRequest,
      [_receivedPostMessageTypes.I18N_LABELS]: this.handleI18nLabels
    }, {
      allowedOrigin: this.embedScriptContext.getIFrameDomain(),
      iframeUuid: this.embedScriptContext.iframeUuid
    });
    this.exitIntentTracker.registerPostMessageReceivers(this.postMessageReceiver);
    this.scrollPercentageTracker.registerPostMessageReceivers(this.postMessageReceiver);
  }

  handleExternalApiEventMessage(message) {
    (0, _handleExternalApiEventMessage.handleExternalApiEventMessage)(message, {
      eventEmitter: this.eventEmitter
    });
  }

  handleScroll({
    scrollPercentage
  }) {
    this.iframeMessage.post(_sentPostMessageTypes.SCROLL_PERCENTAGE_CHANGE, {
      scrollPercentage
    });
  }
  /**
   *
   * @param {MouseEvent} e
   */


  handleExitIntent() {
    this.iframeMessage.post(_sentPostMessageTypes.EXIT_INTENT);
  }

  getStatus() {
    return {
      loaded: this.hasLoadedIframe,
      pending: this.isLoadingIframe
    };
  }
  /**
   * Provides default size for chat launcher
   * to reduce CLS on page load.
   */


  handleIframeLoad() {
    setTimeout(() => this.eventEmitter.trigger('widgetLoaded', {
      message: 'widget has loaded'
    }));
    this.handleWindowResize();
    this.hasLoadedIframe = true;
    this.isLoadingIframe = false;
    (0, _markEnd.markEndPostDelay)();
    this.postPerfAttributes(this.embedScriptContext.getPerfAttributes());
  }

  postPerfAttributes(perfAttributes) {
    // Only send these metrics 50% of the time to
    // stay further away from our New Relic data limit
    if (Math.random() < 0.5) {
      this.iframeMessage.post(_sentPostMessageTypes.PERF_ATTRIBUTES, {
        perfAttributes
      });
    }
  }

  resetAndReloadWidget() {
    this.removeIframe();
    (0, _resetAndLaunchWidget.resetAndLaunchWidget)();
  }

  removeIframe() {
    const iframeContainer = (0, _settingsHelpers.shouldEmbedInline)() ? document.getElementById(_elementSelectors.INLINE_PARENT_ID) : document.getElementById(_elementSelectors.PARENT_ID);

    if (iframeContainer) {
      iframeContainer.remove();
    }

    this.iframeSrc = null;
    this.hasLoadedIframe = false;
    this.isLoadingIframe = false;
  }

  handleResizeMessage({
    data: {
      height,
      width
    } = {}
  }) {
    (0, _resizeWidgetIframe.resizeWidgetIframe)({
      height,
      width,
      isOpen: this.isOpen
    });

    if (height && height > 60 && this.dragHandleEl) {
      this.dragHandleEl.style.setProperty('display', 'flex');
    } else if (this.dragHandleEl) {
      this.dragHandleEl.style.setProperty('display', 'none');
    }

    this.clampPosition();
  }

  setWidgetOpenCookie({
    isOpen
  }) {
    (0, _operators.setCookie)(_constants.cookies.IS_OPEN, isOpen, _times.default.THIRTY_MINUTES);
  }

  handleOpenChange({
    data: {
      isOpen,
      isUser
    }
  }) {
    const html = document.documentElement;
    const parent = document.getElementById(_elementSelectors.PARENT_ID);
    const shadowContainer = parent.getElementsByClassName(_widgetClassNames.SHADOW_CONTAINER)[0];
    this.isOpen = isOpen;

    if (isUser) {
      this.setWidgetOpenCookie({
        isOpen: this.isOpen
      });
    }

    if (this.isOpen) {
      html.classList.add(_widgetClassNames.ACTIVE);
      shadowContainer.classList.add('active');
    } else {
      html.classList.remove(_widgetClassNames.ACTIVE);
      shadowContainer.classList.remove('active');
    }

    if ((0, _whichDevice.isAnyMobile)() && this.isOpen) {
      const height = window.innerHeight;
      const width = window.innerWidth;
      (0, _resizeWidgetIframe.resizeWidgetIframe)({
        height,
        width,
        isOpen: this.isOpen
      });
      this.clampPosition();
    }
  }

  handleRequestWidget({
    source
  }) {
    (0, _sendWidgetDataToIframe.sendWidgetDataToIframe)({
      source,
      widgetData: this.widgetData,
      embedScriptContext: this.embedScriptContext,
      apiUsageTracker: this.apiUsageTracker
    });
  }

  handleStoreMessagesCookie({
    data
  }) {
    this.iframeMessage.post(_sentPostMessageTypes.FIRST_VISITOR_SESSION, {
      isFirstVisitorSession: false
    });

    if ((0, _getGlobalCookieOptOut.getGlobalCookieOptOut)() === 'yes' && this.widgetData.gdprConsentOptions.cookieConsentPrompt !== _gdprCookieConsentTypes.NEVER) {
      window._hsp.push(['showBanner']);
    }

    (0, _setMessagesUtk.setMessagesUtk)(data);
  }

  requestWidgetOpen() {
    if (this.isOpen) {
      this.devLogger.log('cannot open the widget, it is already open.');
      return;
    }

    this.iframeMessage.post(_sentPostMessageTypes.REQUEST_OPEN);
  }

  requestWidgetClose() {
    if (!this.isOpen) {
      this.devLogger.log('cannot close the widget, it is already closed');
      return;
    }

    this.iframeMessage.post(_sentPostMessageTypes.REQUEST_CLOSE);
  }

  handleWindowResize() {
    const data = {
      height: window.innerHeight,
      width: window.innerWidth
    };
    this.iframeMessage.post(_sentPostMessageTypes.BROWSER_WINDOW_RESIZE, data);
    this.clampPosition();
  }

  requestWidgetRefresh({
    openToNewThread
  } = {}) {
    const {
      portalId
    } = this.embedScriptContext;

    if (!this.hasLoadedIframe && this.isLoadingIframe) {
      this.devLogger.log('Cannot refresh the widget - it is currently loading.');
      return;
    }

    if (this.hasLoadedIframe) {
      const requestUrl = this.embedScriptContext.getInitialRequestUrl();
      (0, _fetchWidgetData.fetchWidgetData)({
        requestUrl,
        portalId
      }, widgetData => {
        this.handleWidgetRefresh(widgetData);

        if (openToNewThread) {
          this.openToNewThread();
        }
      });
    } else {
      this.loadWidget();

      if (openToNewThread) {
        this.openToNewThread();
      }
    }
  }

  openToNewThread() {
    this.iframeMessage.post(_sentPostMessageTypes.OPEN_TO_NEW_THREAD);
  }

  extendedClearCookiesFunction(extendedFunction) {
    if (extendedFunction && extendedFunction[_extendedFunctions.RESET_WIDGET]) {
      this.removeIframe();
    }

    (0, _clearCookies.clearCookies)(extendedFunction);
  }

  handleWidgetRefresh(refreshedWidgetData) {
    this.setWidgetData(refreshedWidgetData);

    const shouldHideWidget = (0, _getWidgetDataResponseType.getWidgetDataResponseType)(this.widgetData) === _widgetResponseTypes.HIDE_WIDGET;

    if (shouldHideWidget) {
      this.removeIframe();
    } else {
      this.iframeMessage.post(_sentPostMessageTypes.REFRESH_WIDGET_DATA, Object.assign({}, this.widgetData, {}, (0, _getIframeQueryParams.getIframeQueryParams)(this.embedScriptContext)));
    }
  }

  setWidgetNotLoaded() {
    this.hasLoadedIframe = false;
    this.isLoadingIframe = false;
  }
  /*
   * Load widget data for the current page
   *
   * @param {object}   options
   * @param {boolean} [options.widgetOpen] - whether or not the widget should render
   *                                         in an open state on initial load
   */


  loadWidget(options = {}) {
    const {
      portalId
    } = this.embedScriptContext;

    if (this.isLoadingIframe) {
      this.devLogger.log('Cannot load the widget - The widget is already being loaded.');
      this.logError('load widget called while public widget request is pending');
      return;
    }

    if (this.hasLoadedIframe) {
      this.devLogger.log('Cannot load the widget - the widget has already loaded.');
      return;
    }

    this.isLoadingIframe = true;

    if (options.widgetOpen) {
      this.setWidgetOpenCookie({
        isOpen: true
      });
    }

    (0, _fetchWidgetData.fetchWidgetData)({
      requestUrl: this.embedScriptContext.getInitialRequestUrl(),
      portalId
    }, (0, _handleTargetingAndDelay.handleTargetingAndDelay)(this.setWidgetData, this.loadIFrame, this.setWidgetNotLoaded), () => {
      _events.EVENTS.messagesInitialized({
        messageWillRender: false
      });
    });
  }

  start() {
    const {
      shouldRender
    } = (0, _shouldRenderWidget.shouldRenderWidget)(this.embedScriptContext);

    if (!shouldRender) {
      try {
        // Prototype can cause this to fail
        _events.EVENTS.messagesInitialized({
          messageWillRender: false
        });
      } catch (e) {
        this.devLogger.log(`widget load aborted`);
      }

      return;
    }

    (0, _setupExternalApi.setupExternalApi)({
      debug: this.devLogger.debug,
      on: (eventName, listener) => {
        this.eventEmitter.on(eventName, listener);
        this.apiUsageTracker.trackEventListener(eventName);
      },
      off: this.eventEmitter.off,
      clear: args => {
        this.extendedClearCookiesFunction(args);
        this.apiUsageTracker.trackMethod('clear');
      },
      resetAndReloadWidget: this.resetAndReloadWidget,
      widget: {
        load: (...args) => {
          this.loadWidget(...args);
          this.apiUsageTracker.trackMethod('load');
        },
        remove: () => {
          this.removeIframe();
          this.apiUsageTracker.trackMethod('remove');
        },
        open: () => {
          this.requestWidgetOpen();
          this.apiUsageTracker.trackMethod('open');
        },
        close: () => {
          this.requestWidgetClose();
          this.apiUsageTracker.trackMethod('close');
        },
        refresh: (...args) => {
          this.requestWidgetRefresh(...args);
          this.apiUsageTracker.trackMethod('refresh');
        },
        status: () => {
          this.apiUsageTracker.trackMethod('status');
          return this.getStatus();
        }
      }
    });
    (0, _flushOnReadyCallbacks.flushOnReadyCallbacks)({
      logger: this.devLogger,
      trackCallback: this.apiUsageTracker.trackOnReady
    });
    (0, _registerHashChangeListener.registerHashChangeListener)({
      requestWidgetOpen: this.requestWidgetOpen,
      isOpen: this.isOpen
    });
    (0, _registerWindowResizeListener.registerWindowResizeListener)({
      resizeCallbackFn: this.handleWindowResize
    });
    (0, _registerCookieListeners.registerCookieListeners)({
      postMessageToIframe: this.iframeMessage.post
    });

    if ((0, _settingsHelpers.shouldLoadImmediately)()) {
      this.loadWidget();
    }

    this.postVisitorIdentificationAttributes();
  }

  postVisitorIdentificationAttributes() {
    const {
      identificationEmail,
      identificationToken
    } = this.embedScriptContext;
    this.iframeMessage.post(_sentPostMessageTypes.VISITOR_IDENTIFICATION_ATTRIBUTES, {
      identificationEmail,
      identificationToken
    });
  }

  setFrameClass() {
    const parent = document.getElementById(_elementSelectors.PARENT_ID);
    if (!parent) return;
    const widgetLocation = this.widgetData[_widgetDataKeys.WIDGET_LOCATION];
    (0, _setClassInClassList.setClassInClassList)({
      widgetLocation,
      classList: parent.classList
    });
  }

}

exports.WidgetShell = WidgetShell;