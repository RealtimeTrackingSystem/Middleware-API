const express = require('express');
const handlers = require('../handlers');

const peopleRoute = express.Router();

peopleRoute.get('/api/people',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.people.searchPeople.validateQuery,
  handlers.people.searchPeople.logic);

module.exports = peopleRoute;
