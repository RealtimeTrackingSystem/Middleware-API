const express = require('express');
const handlers = require('../handlers');

const reporterRoute = express.Router();

reporterRoute.get('/api/reporters/:reporterId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reporters.getReporterById.validateParam,
  handlers.reporters.getReporterById.logic,
  handlers.reporters.getReporterById.respond);

module.exports = reporterRoute;
