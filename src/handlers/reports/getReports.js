const Promise = require('bluebird');
const lib = require('../../lib');
const User = require('../../models/User');

const internals = {};
internals.populateUser = function (report) {
  const reporterId = report._reporter && report._reporter._id ? report._reporter._id : report._reporter;
  return User.findOne({
    reporterID: reporterId
  })
    .select('-password')
    .then((user) => {
      if (!user) {
        report.user = null;
      } else {
        report.user = user;
      }
      return report;
    })
    .catch((e) => {
      report.user = null;
    });
};

function validateParams (req, res, next) {
  const schema = {
    limit: {
      optional: true,
      isInt: {
        errorMessage: 'Invalid Parameter: Limit'
      }
    },
    page: {
      optional: true,
      isInt: {
        errorMessage: 'Invalid Parameter: Page'
      }
    }
  };
  req.checkQuery(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'GET /api/reports');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function addOtherOptions (req, res, next) {
  const otherOptions = {};
  if (req.query.reporter) {
    otherOptions.reporter = req.query.reporter;
  }

  if (req.query.host) {
    otherOptions.host = req.query.host;
  }

  req.$scope.otherOptions = otherOptions;
  next();
}

function logic (req, res, next) {
  const tags = req.query.tags;
  const page = req.query.page;
  const limit = req.query.limit;
  const resources = req.query.resources;
  const otherOptions = req.$scope.otherOptions;
  return req.api.report.getReports(tags, page, limit, resources, otherOptions)
    .then(function (response) {
      req.$scope.response = response;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(error, 'GET /api/reports');
      return res.status(500).send(err);
    });
}

function populateUser (req, res, next) {
  const reports = req.$scope.response.reports;
  return Promise.map(reports, internals.populateUser)
    .then((populatedReports) => {
      req.$scope.response.reports = populatedReports;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(error, 'GET /api/reports');
      return res.status(500).send(err);
    });
}

function respond (req, res) {
  const response = req.$scope.response;
  const success = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200
  };
  req.logger.info(success, 'GET /api/reports');
  success.reports = response.reports;
  success.count = response.count;
  res.status(200).send(success);
}

module.exports = {
  validateParams,
  addOtherOptions,
  logic,
  populateUser,
  respond
};
