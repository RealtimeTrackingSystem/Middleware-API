const express = require('express');
const handlers = require('../handlers');

const reportRoute = express.Router();

reportRoute.get('/api/reports',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.reports.getReports.validateParams,
  handlers.reports.getReports.logic);

reportRoute.post('/api/reports',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.reports.postReport.validateBody,
  handlers.reports.postReport.sendReport,
  handlers.reports.postReport.respond);

module.exports = reportRoute;
