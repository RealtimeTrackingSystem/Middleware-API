const express = require('express');
const handlers = require('../handlers');

const reportRoute = express.Router();

reportRoute.get('/api/reports',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.getReports.validateParams,
  handlers.reports.getReports.logic);

reportRoute.post('/api/reports',
  handlers.media.uploads.multipleUpload('reports', 4, 'reports'),
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.postReport.validateBody,
  handlers.reports.postReport.processMediaUploads,
  handlers.reports.postReport.processTags,
  handlers.reports.postReport.processPeopleAndProperties,
  handlers.reports.postReport.sendReport,
  handlers.reports.postReport.respond);

reportRoute.get('/api/reports/:reportId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.getReportsById.validateParams,
  handlers.reports.getReportsById.logic,
  handlers.reports.getReportsById.respond);

module.exports = reportRoute;
