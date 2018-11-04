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
      hostId: report.reporterId
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
}

module.exports = Report;
