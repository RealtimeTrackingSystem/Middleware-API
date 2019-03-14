'use strict';
const rp = require('request-promise');

class Reporter {
  constructor (apiKey, url, port = '') {
    this.apiKey = apiKey;
    this.url = url + ':' + port;
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
      email: reporter.email,
      birthday: reporter.birthday,
      gender: reporter.gender,
      alias: reporter.alias,
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
  updateReporter (reporter) {
    const body = {
      fname: reporter.fname,
      lname: reporter.lname,
      email: reporter.email,
      birthday: reporter.birthday,
      gender: reporter.gender,
      alias: reporter.alias,
      street: reporter.street,
      barangay: reporter.barangay,
      city: reporter.city,
      region: reporter.region,
      country: reporter.country,
      zip: reporter.zip
    };
    const options = {
      uri: this.reporter_url + '/' + reporter.reporterID,
      body: body,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.put(options);
  }
  updateReporterProfilePic (reporterId, file) {
    const body = {
      file: file
    };
    const options = {
      uri: this.reporter_url + '/profilepic/' + reporterId,
      body: body,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.put(options);
  }
  addOrUpdateFirebaseToken (reporterId, deviceId, token) {
    const body = {
      reporterId, deviceId, token
    };
    const options = {
      uri: this.reporter_url + '/firebase',
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