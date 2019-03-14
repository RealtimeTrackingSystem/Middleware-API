const lib = require('../../lib');
const mailtemplates = require('../../assets/mailtemplates');

function validateBody (req, res, next) {
  const schema = {
    email: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Email',
      isEmail: {
        errorMessage: 'Invalid Parameter: Email'
      }
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn(errorObject, 'POST /api/auth/signup');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function checkUserEmail (req, res, next) {
  const email = req.body.email;
  return req.DB.User.findByUsernameOrEmail(email)
    .then(function (user) {
      if (!user) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Email -> Cannot find user'
        };
        return res.status(error.httpCode).send(error);
      }
      req.$scope.user = user;
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      // req.logger.error(err, 'DELETE /api/auth/password');
      res.status(500).send(error);
    });
}

function logic (req, res, next) {
  const user = req.$scope.user;
  return req.DB.User.forgotPassword(user._id)
    .then(function (result) {
      req.$scope.temporaryPassword = result.temporaryPassword;
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
      // req.logger.error(err, 'DELETE /api/auth/password');
      res.status(error.httpCode).send(error);
    });
}

function sendEmail (req, res, next) {
  const temporaryPassword = req.$scope.temporaryPassword;
  const userNotif = mailtemplates.changePassword(temporaryPassword);
  const user = req.$scope.user;
  const mails = [
    { receiver: user.email, sender: 'report-api-team@noreply', subject: 'FORGOT PASSWORD', htmlMessage: userNotif },
  ];
  return req.mailer.bulkSimpleMail(mails)
    .then(function (results) {
      req.$scope.sentMails = results;
      // req.logger.info(results, 'DELETE /api/auth/password');
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      error.message = 'Unable to send temporary password, Please try again.';
      // req.logger.error(err, 'DELETE /api/auth/password');
      res.status(500).send(error);
    });
}

function respond (req, res) {
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  // req.logger.info(result, 'DELETE /api/auth/password');
  res.status(result.httpCode).send(result);
}

module.exports = {
  validateBody,
  checkUserEmail,
  logic,
  sendEmail,
  respond
};
