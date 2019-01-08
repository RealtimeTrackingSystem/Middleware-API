const express = require('express');
const handlers = require('../handlers');

const peopleRoute = express.Router();

peopleRoute.get('/api/people',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.people.searchPeople.validateQuery,
  handlers.people.searchPeople.logic);

peopleRoute.get('/api/people/host-members/:hostId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.people.searchMembers.validateQuery,
  handlers.people.searchMembers.logic);

module.exports = peopleRoute;
