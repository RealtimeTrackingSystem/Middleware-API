'use strict';

const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    hostId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Host ID'
    },
    userId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: User ID'
    },
    isAdmin: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Is Admin'
    }
  };

  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn(errorObject, 'POST /api/hosts/admin');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res) {
  const { hostId, userId, isAdmin } = req.body;
  return req.DB.User.setAsAdmin(userId, hostId, isAdmin)
    .then((result) => {
      // req.logger.info(result, 'POST /api/hosts/admin');
      res.status(201).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201
      });
    })
    .catch((err) => {
      const error = {
        status: 'ERROR'
      };
      if (err.error) {
        error.statusCode = 2;
        error.httpCode = 400;
        error.message = err.message;
        // req.logger.warn(err, 'POST /api/hosts/admin');
      } else {
        error.statusCode = 1;
        error.httpCode = 500;
        error.message = 'Internal Server Error';
        // req.logger.error(err, 'POST /api/hosts/admin');
      }
      res.status(error.httpCode).send(error);
    });
}

module.exports = {
  validateBody,
  logic
};
