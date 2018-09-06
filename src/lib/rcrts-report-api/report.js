'use strict';
const rp = require('request-promise');


class Report {
  constructor (apiKey, url) {
    this.apiKey = apiKey;
    this.url = url;
    this.report_url = this.url + '/api/reports';
  }
  getReports (tags, page, limit, resources) {
    const options = {
      uri: this.report_url,
      qs: {
        tags: tags,
        page: page,
        limit: limit,
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
      tags: report.tags
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
