const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    status: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Status'
    },
    note: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Note'
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn(errorObject, 'PUT /api/reports/status/:reportId');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function setToVoid (req, res, next) {
  const reportId = req.params.reportId;
  return req.api.report.cancelReport(reportId)
    .then(function (response) {
      req.$scope.response = response;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      // req.logger.error('PUT /api/reports/status/:reportId', error);
      if (error.response.body && error.response.body.httpCode) {
        res.status(error.response.body.httpCode).send(error.response.body);
      }
      req.$scope.filesToDelete = req.files;
      res.status(500).send(err);
      next();
    });
}

function logic (req, res, next) {
  let { status, note } = req.body;
  const reportId = req.params.reportId;
  const user = req.user;
  note += ` (Updated by: ${user.fname} ${user.lname}, ID ${user._id}, Email: ${user.email})`;
  return req.api.report.putReportStatus(reportId, status.toUpperCase(), note)
    .then(function (response) {
      req.$scope.response = response;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      // req.logger.error('PUT /api/reports/status/:reportId', error);
      if (error.response.body && error.response.body.httpCode) {
        res.status(error.response.body.httpCode).send(error.response.body);
      }
      req.$scope.filesToDelete = req.files;
      res.status(500).send(err);
      next();
    });
}

function respond (req, res) {
  const response = req.$scope.response;
  // req.logger.info(response, 'PUT /api/reports/status/:reportId');
  res.status(201).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  });
}

module.exports = {
  validateBody,
  logic,
  setToVoid,
  respond
};
