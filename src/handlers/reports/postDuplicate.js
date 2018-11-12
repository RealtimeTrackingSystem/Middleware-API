const lib = require('../../lib');

function validateParams (req, res, next) {
  const duplicates = req.body.duplicates;
  const error = {
    status: 'ERROR',
    httpCode: 400
  };
  if (!duplicates) {
    error.statusCode = 2;
    error.message = 'Missing Parameter: Duplicates';
  }
  if (!Array.isArray(duplicates) || duplicates.length < 1) {
    error.statusCode = 3;
    error.message = 'Invalid Parameter: Duplicates';
  }
  if (error.statusCode) {
    req.logger.warn(error, 'POST /api/reports/duplicates');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function logic (req, res) {
  const duplicates = req.body.duplicates;
  return req.api.report.duplicateReport(duplicates)
    .then(function (response) {
      req.logger.info(response, 'POST /api/reports/duplicates');
      res.status(201).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201
      });
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('POST /api/reports', error);
      if (error.response.body && error.response.body.httpCode) {
        res.status(error.response.body.httpCode).send(error.response.body);
      }
      req.$scope.filesToDelete = req.files;
      res.status(500).send(err);
    });
}


module.exports = {
  validateParams,
  logic
};
