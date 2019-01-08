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
}

module.exports = People;
