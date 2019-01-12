const lib = require('../../lib');

const internals = {};

internals.catchError = (err, req, res) => {
  req.logger.error(err, 'POST /api/people/clearances');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

function validateBody (req, res, next) {
  const schema = {
    personId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Person Id'
    },
    clearanceNotes: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Clearance Notes'
    },
    reporterId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Reporter Id'
    },
    reporterFname: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Reporter Firstname'
    },
    reporterLname: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Reporter Lastname'
    },
    reporterEmail: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Reporter Email'
    }
  };
  req.checkBody(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('POST /api/people/clearances', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res) {
  const { personId, clearanceNotes, reporterId, reporterLname, reporterFname, reporterEmail } = req.body;
  const reporterMetaData = {
    reporterLname,
    reporterFname,
    reporterEmail
  };
  return req.api.people.sendClearance({
    personId, clearanceNotes, reporterId, reporterMetaData
  })
    .then(function (result) {
      res.status(201).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201
      });
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('POST /api/people/clearances', error);
      if (error.response.body && error.response.body.httpCode) {
        return res.status(error.response.body.httpCode).send(error.response.body);
      }
      res.status(500).send(err);
    });
}

module.exports = {
  validateBody,
  logic
};
