const express = require('express');
const handlers = require('../handlers');

const reportRoute = express.Router();

reportRoute.put('/api/reports/fileActions/:fileActionId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.updateFileAction.logic);

reportRoute.post('/api/reports/fileActions',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.addFileAction.logic);

reportRoute.get('/api/reports/mediationNotes/:mediationNoteId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.getMediationById.logic);

reportRoute.post('/api/reports/mediationNotes',
  handlers.media.uploads.multipleUpload('mediation', 1, 'mediation'),
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.authentication.checkHostAdminship,
  handlers.reports.addMediation.processMedia,
  handlers.reports.addMediation.logic);

reportRoute.post('/api/v1/reports/mass-update-status',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.authentication.checkHostAdminship,
  handlers.reports.massStatusUpdate.validateParams,
  handlers.reports.massStatusUpdate.logic);

reportRoute.get('/api/reports/search/:searchString',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.searchReports.validateParams,
  handlers.reports.searchReports.validateQuery,
  handlers.reports.searchReports.logic);

reportRoute.post('/api/reports/duplicates/bulk',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.authentication.checkHostAdminship,
  handlers.reports.postDuplicate.validateParams,
  handlers.reports.postDuplicate.logic);

reportRoute.get('/api/reports/duplicates',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.getDuplicateReports.logic,
  handlers.reports.getDuplicateReports.respond);

reportRoute.post('/api/reports/duplicates',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.authentication.checkHostAdminship,
  handlers.reports.postDuplicateReport.validateBody,
  handlers.reports.postDuplicateReport.logic,
  handlers.reports.postDuplicateReport.respond);

reportRoute.put('/api/reports/duplicates',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.authentication.checkHostAdminship,
  handlers.reports.putRemoveDuplicateReport.validateBody,
  handlers.reports.putRemoveDuplicateReport.logic,
  handlers.reports.putRemoveDuplicateReport.respond);

reportRoute.get('/api/reports',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.getReports.validateParams,
  handlers.reports.getReports.addOtherOptions,
  handlers.reports.getReports.logic,
  handlers.reports.getReports.populateUser,
  handlers.reports.getReports.respond);

reportRoute.post('/api/reports',
  handlers.media.uploads.multipleUpload('reports', 4, 'reports'),
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.postReport.validateBody,
  handlers.reports.postReport.checkCategory,
  handlers.media.uploads.destroyUploadedFiles,
  handlers.reports.postReport.processMediaUploads,
  handlers.reports.postReport.processTags,
  handlers.reports.postReport.processPeopleAndProperties,
  handlers.reports.postReport.sendReport,
  handlers.media.uploads.destroyUploadedFiles,
  handlers.reports.postReport.respond);

reportRoute.put('/api/reports/status/:reportId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.authentication.checkHostAdminship,
  handlers.reports.putReportStatus.validateBody,
  handlers.reports.putReportStatus.logic,
  handlers.reports.putReportStatus.respond);

reportRoute.delete('/api/reports/status/:reportId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.putReportStatus.setToVoid,
  handlers.reports.putReportStatus.respond);

reportRoute.get('/api/reports/:reportId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.reports.getReportsById.validateParams,
  handlers.reports.getReportsById.logic,
  handlers.reports.getReportsById.populateUser,
  handlers.reports.getReportsById.respond);

module.exports = reportRoute;
