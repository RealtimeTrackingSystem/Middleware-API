const lib = require('../../lib');
const ALLOWED_RESOURCES = ['reporter', 'host', 'people', 'properties', 'medias'];

const internals = {};

internals.serverError = function (err, req, res) {
  req.logger.error(err, 'GET /api/reports/search/:searchString');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

function validateQuery (req, res, next) {
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
    },
    hostId: {
      optional: true
    },
    isDuplicate: {
      optional: true
    }
  };
  req.checkQuery(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('GET /api/reports', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function validateParams (req, res, next) {
  const searchString = req.params.searchString;
  if (!searchString) {
    const error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Missing Parameters: Search String'
    };
    req.logger.warn(error, 'GET /api/reports/search/:searchString');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function logic (req, res) {
  const { page, limit, hostId, isDuplicate } = req.query;
  const searchString = req.params.searchString;
  const options = {};
  if (hostId) {
    options.hostId = hostId;
  }
  if (isDuplicate != null) {
    options.isDuplicate = isDuplicate;
  }
  return req.api.report.searchReport(searchString, page, limit, options)
    .then(function (response) {
      const success = {
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200
      };
      req.logger.info(success, 'GET /api/reports/search/:searchString');
      success.reports = response.reports;
      success.count = response.count;
      res.status(200).send(success);
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(error, 'GET /api/reports/search/:searchString');
      return res.status(500).send(err);
    });
}

module.exports = {
  validateParams,
  validateQuery,
  logic
};
