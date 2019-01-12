'use strict';
const rp = require('request-promise');

class People {
  constructor (apiKey, url, port = '') {
    this.apiKey = apiKey;
    this.url = url + ':' + port;
    this.people_url = this.url + '/api/people';
  }
  getPeople (search = null, page = null, limit = null, config = {}) {
    let qs = {};
    if (search) {
      qs.search = search;
    }
    if (page) {
      qs.page = page;
    }
    if (limit) {
      qs.limit = limit;
    }
    if (config.isCulprit) {
      qs.isCulprit = config.isCulprit;
    }

    const options = {
      uri: this.people_url,
      qs: qs,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  getSummonById (summonId) {
    const options = {
      uri: this.people_url + '/summons/' + summonId,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  sendSummon (personId) {
    const options = {
      uri: this.people_url + '/summons',
      body: {
        personId: personId
      },
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
  updateSummon (summonId, compliance, complianceNotes) {
    const options = {
      uri: this.people_url + '/summons/' + summonId,
      body: {
        compliance, complianceNotes
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

module.exports = People;
