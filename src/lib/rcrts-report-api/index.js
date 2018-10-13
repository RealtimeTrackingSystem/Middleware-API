'use strict';
const Report = require('./report');
const Reporter = require('./reporter');
const Host = require('./host');

class RctsReportApi {
  constructor (apiKey, url) {
    this.apiKey = apiKey;
    this.url = url;
    this.report = new Report(this.apiKey, this.url);
    this.reporter = new Reporter(this.apiKey, this.url);
    this.host = new Host(this.apiKey, this.url);
  }
}

module.exports = RctsReportApi;
