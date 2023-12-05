"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostMessageApiClient = void 0;

var _http = require("../requests/http");

var _sentPostMessageTypes = require("./constants/sentPostMessageTypes");

class PostMessageApiClient {
  constructor(postMessage) {
    this.makeApiRequest = ({
      data
    }) => {
      const {
        type,
        url,
        data: requestData
      } = data;
      const fullUrl = `/_hcms${url}`;

      if (this.currentRequest && this.currentRequest.readyState !== _http.DONE_STATE) {
        this.abortCurrentApiRequest();
      }

      this.currentRequest = (0, _http.doRequest)(type)(fullUrl, requestData)((result, error) => {
        if (!error) {
          this.postMessage(_sentPostMessageTypes.API_REQUEST_RESULT, {
            result: 'succeeded',
            data: result,
            url
          });
        } else {
          this.postMessage(_sentPostMessageTypes.API_REQUEST_RESULT, {
            result: 'failed',
            data: error,
            url
          });
        }
      });
    };

    this.postMessage = postMessage;
    this.currentRequest = null;
  }

  abortCurrentApiRequest() {
    if (this.currentRequest) {
      this.currentRequest.abort();
    }
  }

}

exports.PostMessageApiClient = PostMessageApiClient;