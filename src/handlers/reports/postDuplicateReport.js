const lib = require('../../lib');
function validateBody (req, res, next) {
  const schema = {
    parentDuplicate: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Parent Duplicate Report'
    },
    duplicate: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Duplicate Report'
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'POST /api/reports/duplicates');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }

}

function logic (req, res, next) {
  const { parentDuplicate, duplicate } = req.body;
  return req.api.duplicateReport(parentDuplicate, duplicate)
    .then(response => {
      req.logger.info(response, 'POST /api/reports/duplicates');
      req.$scope.response = response;
      next();
    })
    .catch(function (err) {
      if (err.httpCode) {
        req.logger.warn(err, 'POST /api/reports/duplicates');
        return res.status(err.httpCode).send(err);
      }
      req.logger.error(err, 'POST /api/reports/duplicates');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function respond (req, res) {
  req.logger.info(req.$scope.report, 'POST /api/reports/duplicates');
  res.status(200).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  });
}

module.exports = {
  validateBody,
  logic,
  respond
};
