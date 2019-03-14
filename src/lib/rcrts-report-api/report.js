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
  cancelReport (reportId) {
    const options = {
      uri: this.report_url + '/status' + '/' + reportId,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.delete(options);
  }
  searchReport (searchString, page, limit, searchOptions = {}) {
    let qs = {
      page: page,
      limit: limit
    };

    if (searchOptions.hostId) {
      qs.hostId = searchOptions.hostId;
    }

    if (searchOptions.isDuplicate != null) {
      console.log('\n\n\n\n\n\n\n', searchOptions.isDuplicate, '\n\n\n\n\n\n\n\n');
      qs.isDuplicate = searchOptions.isDuplicate;
    }

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
  bulkDuplicateReport (duplicates) {
    const options = {
      uri: this.report_url + '/duplicates/bulk',
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
  getDuplicates (isDuplicate = true) {
    const options = {
      uri: this.report_url + '/duplicates',
      qs: {
        isDuplicate: isDuplicate
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  duplicateReport (parentReport, duplicateReport) {
    const options = {
      uri: this.report_url + '/duplicates',
      body: {
        duplicate: duplicateReport,
        parentDuplicate: parentReport
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
  removeDuplicateReport (duplicateReport) {
    const options = {
      uri: this.report_url + '/duplicates',
      body: {
        duplicate: duplicateReport
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.put(options);
  }
  addMediationNote (mediationNote) {
    const { reportId, note, reporterId, media} = mediationNote;
    const body = {
      reportId,
      note,
      reporterId,
      media
    };
    const options = {
      uri: this.report_url + '/mediationNotes',
      body: body,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
  getMediationNoteById (mediationNoteId) {
    const options = {
      uri: this.report_url + '/mediationNotes/' + mediationNoteId,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  addFileAction (fileAction) {
    const { reportId, note } = fileAction;
    const options = {
      uri: this.report_url + '/fileActions',
      body: {
        reportId, note
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
  updateFileAction (fileActionId, note) {
    const options = {
      uri: this.report_url + '/fileActions/' + fileActionId,
      body: {
        note
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.put(options);
  }
}

module.exports = Report;
