const lib = require('../../lib');
const DB = require('../../models');

function rollBack (userId, err) {
  return DB.User.findByIdAndRemove(userId)
    .then(function () {
      return err;
    });
}

function validateParams (req, res, next) {
  const schema = {
    username: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Username',
      isLength: {
        options: { min: 6, max: 20 },
        errorMessage: 'Invalid Parameter Length: Username'
      }
    },
    email: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Email',
      isEmail: {
        errorMessage: 'Invalid Parameter: Email'
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
    fname: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: First Name',
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: First Name'
      }
    },
    lname: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Last Name',
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: Last Name'
      }
    },
    gender: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Gender'
    },
    alias: {
      optional: true,
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: Alias'
      }
    },
    street: {
      optional: true,
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: Street'
      }
    },
    barangay: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Barangay'
      }
    },
    city: {
      optional: true,
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: City'
      }
    },
    region: {
      optional: true,
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: Region'
      }
    },
    country: {
      optional: true,
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: Country'
      }
    },
    zip: {
      optional: true,
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: Zip'
      }
    }
  };
  req.checkBody(schema);
  req.checkBody()
    .equalPasswords()
    .withMessage('Invalid Parameter: Password Confirmation');
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'POST /api/auth/signup');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function checkDuplicateCredentials (req, res, next) {
  return req.DB.User.findByUsernameOrEmail(req.body.username, req.body.email)
    .then(function (user) {
      if (user) {
        const error = lib.errorResponses.validationError([{msg: 'Invalid Parameter: Username or Email - Already In Use'}]);
        req.logger.warn(error, 'POST /api/auth/signup');
        return res.status(400).send(error);
      }
      return next();
    }).catch(function (err) {
      req.logger.error(err, 'POST /api/auth/signup');
      const errorObject = lib.errorResponses.internalServerError('Failed in Checking Credentials');
      return res.status(errorObject.httpCode).send(errorObject);
    });
}

function addUserToScope (req, res, next) {
  const user = req.body;
  req.$scope.user = {
    username: user.username,
    email: user.email,
    password: user.password,
    fname: user.fname,
    lname: user.lname,
    gender: user.gender,
    alias: user.alias,
    age: user.age,
    street: user.street,
    barangay: user.barangay,
    city: user.city,
    region: user.region,
    country: user.country,
    zip: user.zip,
    reporterID: user.reporterID
  };
  return next();
}

function logic (req, res, next) {
  return req.DB.User.add(req.$scope.user)
    .then(function (user) {
      user = user.toObject();
      delete user.password;
      req.$scope.newUser = user;
      return next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(err, 'POST /api/auth/signup');
      res.status(500).send(error);
    });
}

function replicateUser (req, res, next) {
  const user = req.$scope.newUser;
  const reporter = {
    fname: user.fname,
    lname: user.lname,
    street: user.street,
    barangay: user.barangay,
    city: user.city,
    region: user.region,
    country: user.country,
    zip: user.zip
  };
  return req.api.reporter.addReporter(reporter)
    .then(function (result) {
      req.$scope.reporter = result.reporter;
      return next();
    })
    .catch(function (err) {
      req.logger.error(err, 'POST /api/auth/signup');
      return rollBack(user._id, err)
        .then(function (result) {
          const error = result.response.body;
          res.status(error.httpCode).send(error);
        })
        .catch(function (err) {
          const error = lib.errorResponses.internalServerError('Internal Server Error');
          req.logger.error(err, 'POST /api/auth/signup');
          res.status(500).send(error);
        });
    });
}

function appendReporterId (req, res, next) {
  const reporter = req.$scope.reporter;
  const user = req.$scope.newUser;
  return req.DB.User.addReporterId(user._id, reporter._id)
    .then(function (user) {
      user = user.toObject();
      delete user.password;
      req.$scope.newUser = user;
      req.$scope.token = lib.crypto.encodeToken(user);
      next();
    })
    .catch(function (err) {
      req.logger.error(err, 'POST /api/auth/signup');
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      return rollBack(user._id, error)
        .then(function (result) {
          const error = result.response.body;
          res.status(error.httpCode).send(error);
        })
        .catch(function (err) {
          req.logger.error(err, 'POST /api/auth/signup');
          res.status(500).send(error);
        });
    });
}

function respond (req, res) {
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    payload: {
      user: req.$scope.newUser,
      token: req.$scope.token
    }
  };
  req.logger.info(result, 'POST /api/auth/signup');
  res.status(result.httpCode).send(result);
}

module.exports = {
  validateParams,
  checkDuplicateCredentials,
  addUserToScope,
  logic,
  replicateUser,
  appendReporterId,
  respond
};
