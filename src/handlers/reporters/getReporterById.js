const lib = require('../../lib');

function validateParam (req, res, next) {
  const isObjectId = lib.customValidators.isObjectId(req.params.reporterId);
  if (!isObjectId) {
    const error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Invalid Parameter: Reporter ID'
    };
    // req.logger.warn(error, 'GET /api/reporters/:reporterId');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function logic (req, res, next) {
  const reporterId = req.params.reporterId;
  return req.api.reporter.getReporterById(reporterId)
    .then(function (result) {
      if (!result.reporter) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 404,
          message: 'Reporter Not Found'
        };
        // req.logger.warn(error, 'GET /api/reporters/:reporterId');
        return res.status(error.httpCode).send(error);
      }
      req.$scope.reporter = result.reporter;
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      // req.logger.error(err, 'GET /api/reporters/:reporterId');
      res.status(error.httpCode).send(error);
    });
}

function respond (req, res) {
  const success = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    reporter: req.$scope.reporter
  };
  // req.logger.info(success, 'GET /api/reporters/:reporterId');
  res.status(success.httpCode).send(success);
}

module.exports = {
  validateParam,
  logic,
  respond
};
