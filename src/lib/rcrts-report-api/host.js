'use strict';
const rp = require('request-promise');

class Host {
  constructor (apiKey, url) {
    this.apiKey = apiKey;
    this.url = url;
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
  getHosts (page, limit, filter) {
    const options = {
      uri: this.host_url,
      qs: {
        page: page,
        limit: limit,
        filter: filter
      },
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
}

module.exports = Host;
