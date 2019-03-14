const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    deviceId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Device Id'
    },
    token: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Token'
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn('POST /api/reporters/firebaseToken', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res, next) {
  const reporterId = req.user.reporterID;
  const { deviceId, token } = req.body;
  return req.api.reporter.addOrUpdateFirebaseToken(reporterId, deviceId, token)
    .then(result => {
      // req.logger.info(result, 'POST /api/reporters/firebaseToken');
      res.status(201).send({
        status: 'SUCCESS',
        httpCode: 200,
        statusCode: 0
      });
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      // req.logger.error(error, 'POST /api/reporters/firebaseToken');
      if (error.response.body && error.response.body.httpCode) {
        res.status(error.response.body.httpCode).send(error.response.body);
      }
      req.$scope.filesToDelete = req.files;
      res.status(500).send(err);
      next();
    });
}

module.exports = {
  validateBody,
  logic
};
