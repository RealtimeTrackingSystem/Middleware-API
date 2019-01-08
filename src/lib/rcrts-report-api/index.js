'use strict';
const Report = require('./report');
const Reporter = require('./reporter');
const Host = require('./host');
const People = require('./people');

class RctsReportApi {
  constructor (apiKey, url, apiPort) {
    this.apiKey = apiKey;
    this.url = url;
    this.port = apiPort;
    this.report = new Report(this.apiKey, this.url, this.port);
    this.reporter = new Reporter(this.apiKey, this.url, this.port);
    this.host = new Host(this.apiKey, this.url, this.port);
    this.people = new People(this.apiKey, this.url, this.port);
  }
}

module.exports = RctsReportApi;
