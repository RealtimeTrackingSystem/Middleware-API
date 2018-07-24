const lib = require('../../lib');

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
    alias: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Alias'
      }
    },
    street: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
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
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: City'
      }
    },
    region: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Region'
      }
    },
    country: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Country'
      }
    },
    zip: {
      optional: true,
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: 'Invalid Parameter Length: Zip'
      }
    },
    reporterID: {
      optional: true,
      isLength: {
        options: { min: 2, max: 30 },
        errorMessage: 'Invalid Parameter Length: Reporter ID'
      }
    },
    adminHosts: {
      optional: true,
      isArray: {
        errorMessage: 'Invalid Parameter: Admin Hosts'
      }
    },
    memberHosts: {
      optional: true,
      isArray: {
        errorMessage: 'Invalid Parameter: Member Hosts'
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
    req.logger.warn('POST /api/auth/signup', errorObject);
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
        req.logger.warn('POST /api/auth/signup', error);
        return res.status(400).send(error);
      }
      return next();
    }).catch(function (err) {
      req.logger.error('POST /api/auth/signup', err);
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
    alias: user.alias,
    age: user.age,
    street: user.street,
    barangay: user.barangay,
    city: user.city,
    region: user.region,
    country: user.country,
    zip: user.zip,
    reporterID: user.reporterID,
    adminHosts: user.adminHosts || [],
    memberHosts: user.memberHosts || []
  };
  return next();
}

function logic (req, res, next) {
  return req.DB.User.add(req.$scope.user)
    .then(function (user) {
      delete user.password;
      req.$scope.newUser = user;
      return next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('POST /api/auth/signup', err);
      res.status(500).send(error);
    });
}

function respond (req, res) {
  res.status(201).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    user: req.$scope.newUser._id
  });
}

module.exports = {
  validateParams,
  checkDuplicateCredentials,
  addUserToScope,
  logic,
  respond
};
