'use strict';
const rp = require('request-promise');

class Reporter {
  constructor (apiKey, url) {
    this.apiKey = apiKey;
    this.url = url;
    this.reporter_url = this.url + '/api/reporters';
  }
  getReporters (page, limit) {
    const options = {
      uri: this.reporter_url,
      qs: {
        page: page,
        limit: limit
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  getReporterById (reporterId) {
    const options = {
      uri: this.reporter_url + '/' + reporterId,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  addReporter (reporter) {
    const body = {
      fname: reporter.fname,
      lname: reporter.lname,
      street: reporter.street,
      barangay: reporter.barangay,
      city: reporter.city,
      region: reporter.region,
      country: reporter.country,
      zip: reporter.zip
    };
    const options = {
      uri: this.reporter_url,
      body: body,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
}

module.exports = Reporter;