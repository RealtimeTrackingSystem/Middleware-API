const lib = require('../../lib');

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

function logic (req, res) {
  const tags = req.query.tags;
  const page = req.query.page;
  const limit = req.query.limit;
  const resources = req.query.resources;
  const otherOptions = req.$scope.otherOptions;
  return req.api.report.getReports(tags, page, limit, resources, otherOptions)
    .then(function (response) {
      const success = {
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200
      };
      req.logger.info(success, 'GET /api/reports');
      success.reports = response.reports;
      success.count = response.count;
      res.status(200).send(success);
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(error, 'GET /api/reports');
      return res.status(500).send(err);
    });
}

module.exports = {
  validateParams,
  addOtherOptions,
  logic
};
