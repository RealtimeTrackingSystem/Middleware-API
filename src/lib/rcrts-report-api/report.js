'use strict';
const rp = require('request-promise');


class Report {
  constructor (apiKey, url, port = '') {
    this.apiKey = apiKey;
    this.url = url + ':' + port;
    this.report_url = this.url + '/api/reports';
  }
  getReports (tags, page, limit, resources, others = {}) {
    let qs = {
      tags: tags,
      page: page,
      limit: limit,
      resources: resources
    };
    if (others.reporter) {
      qs.reporter = others.reporter;
    }
    if (others.host) {
      qs.host = others.host;
    }
    const options = {
      uri: this.report_url,
      qs: qs,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  getReportById (reportId, resources) {
    const options = {
      uri: this.report_url + '/' + reportId,
      qs: {
        resources: resources
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  createReport (report) {
    const body = {
      title: report.title,
      description: report.description,
      location: report.location,
      long: report.long,
      lat: report.lat,
      people: report.people,
      properties: report.properties,
      medias: report.medias,
      tags: report.tags,
      reporterId: report.reporterId,
      hostId: report.hostId,
      category: report.category,
      urgency: report.urgency
    };
    const options = {
      uri: this.report_url,
      body: body,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
  putReportStatus (reportId, status, note) {
    const body = { status, note };
    const options = {
      uri: this.report_url + '/status' + '/' + reportId,
      body: body,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.put(options);
  }
  searchReport (searchString, page, limit, resources) {
    let qs = {
      page: page,
      limit: limit,
      resources: resources
    };

    const options = {
      uri: this.report_url + '/search' + '/' + searchString,
      qs: qs,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  duplicateReport (duplicates) {
    const options = {
      uri: this.report_url + '/duplicates',
      body: {
        duplicates: duplicates
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
  massStatusUpdate (reportUpdates) {
    // reportUpdates is an array of
    // { reportId: '', status: '' }
    const options = {
      uri: this.report_url + '/mass-update-status',
      body: {
        reportUpdates: reportUpdates
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
}

module.exports = Report;
