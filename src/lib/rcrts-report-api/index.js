'use strict';
const Report = require('./report');

class RctsReportApi {
  constructor (apiKey, url) {
    this.apiKey = apiKey;
    this.url = url;
    this.report = new Report(this.apiKey, this.url);
  }
}

module.exports = RctsReportApi;
