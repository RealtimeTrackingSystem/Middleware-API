const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    oldPassword: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Old Password',
      isLength: {
        options: { min: 6, max: 20 },
        errorMessage: 'Invalid Parameter Length: Old Password'
      }
    },
    password: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Password',
      isLength: {
        options: { min: 6, max: 20 },
        errorMessage: 'Invalid Parameter Length: Password'
      }
    },
    passwordConfirmation: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Password Confirmation',
      isLength: {
        options: { min: 6, max: 20 },
        errorMessage: 'Invalid Parameter Length: Password Confirmation'
      }
    },
  };
  req.checkBody(schema);
  req.checkBody()
    .equalPasswords()
    .withMessage('Invalid Parameter: Password Confirmation');

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn(errorObject, 'PUT /api/auth/password');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res, next) {
  const user = req.user;
  const  { password, oldPassword } = req.body;
  return req.DB.User.updatePassword(user._id, oldPassword, password)
    .then(function (userData) {
      if (!userData) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Email'
        };
        return res.status(error.httpCode).send(error);
      }
      next();
    })
    .catch(function (err) {
      let error;
      if (!err.success && err.reason) {
        error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: err.reason
        };
      } else {
        error = lib.errorResponses.internalServerError('Internal Server Error');
      }
      // req.logger.error(err, 'PUT /api/auth/password');
      res.status(error.httpCode).send(error);
    });
}

function respond (req, res) {
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  // req.logger.info(result, 'PUT /api/auth/password');
  res.status(result.httpCode).send(result);
}

module.exports = {
  validateBody,
  logic,
  respond
};
