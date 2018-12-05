const express = require('express');
const handlers = require('../handlers');

const reporterRoute = express.Router();

reporterRoute.post('/api/reporters/firebase',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reporters.addOrUpdateFirebaseToken.validateBody,
  handlers.reporters.addOrUpdateFirebaseToken.logic);

reporterRoute.get('/api/reporters/:reporterId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reporters.getReporterById.validateParam,
  handlers.reporters.getReporterById.logic,
  handlers.reporters.getReporterById.respond);

module.exports = reporterRoute;
