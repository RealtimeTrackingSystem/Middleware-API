'use strict';
const rp = require('request-promise');

class Host {
  constructor (apiKey, url, port = '') {
    this.apiKey = apiKey;
    this.url = url + ':' + port;
    this.host_url = this.url + '/api/hosts';
  }
  createHost (host) {
    const body = {
      name: host.name,
      email: host.email,
      location: host.location,
      description: host.description,
      hostNature: host.hostNature,
      defaultTags: host.defaultTags || [],
      long: host.long,
      lat: host.lat,
      street: host.street,
      barangay: host.barangay,
      city: host.city,
      region: host.region,
      country: host.country,
      zip: host.zip
    };
    const options = {
      uri: this.host_url,
      body: body,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.post(options);
  }
  getHosts (page = null, limit = null, filter) {
    const qs = {};
    if (page) {
      qs.page = page;
    }
    if (limit) {
      qs.limit = limit;
    }
    if (filter) {
      qs.filter = filter;
    }
    let options = {
      uri: this.host_url,
      qs: qs,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  getHostById (hostId) {
    const options = {
      uri: this.host_url + '/' + hostId,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.get(options);
  }
  approveHost (hostId) {
    const options = {
      uri: this.host_url + '/approval/' + hostId,
      headers: {
        'api-key': this.apiKey,
        'content-type': 'application/json'
      },
      json: true
    };
    return rp.put(options);
  }
  searchHostPaginated (searchString, page = 0, limit = 30) {
    const qs = {};
    if (page) {
      qs.page = page;
    }
    if (limit) {
      qs.limit = limit;
    }
    let options = {
      uri: this.host_url + '/search-paginated/' + searchString,
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

module.exports = Host;
