const lib = require('../../lib');
const internals = {};
internals.catchError = (error, req, res) => {
  const err = {
    status: 'ERROR',
    statusCode: 0,
    httpCode: 500,
    message: 'Internal Server Error'
  };
  req.logger.error(error, 'PUT /api/auth/user');
  res.status(err.httpCode).send(err);
};

internals.rollbackUser = (req, res) => {
  const userData = req.user;
  const body = {
    fname: userData.fname,
    lname: userData.lname,
    email: userData.email,
    age: userData.age,
    gender: userData.gender,
    alias: userData.alias,
    street: userData.street,
    barangay: userData.barangay,
    city: userData.city,
    region: userData.region,
    country: userData.country,
    zip: userData.zip
  };
  return req.DB.User.findByIdAndUpdate(userData._id, body)
    .then((user) => {
      const error = {
        status: 'ERROR',
        statusCode: 0,
        httpCode: 500,
        message: 'Failed to update reporter details'
      };
      req.logger.error(error, 'PUT /api/auth/user');
      res.status(500).send(error);
    })
    .catch(err => internals.catchError(err, req, res));
};

function validateBody (req, res, next) {
  const schema = {
    fname: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: First Name',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: First Name'
      }
    },
    lname: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Last Name',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Last Name'
      }
    },
    email: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Email',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Email'
      }
    },
    gender: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Gender',
      isLength: {
        options: { min: 1, max: 50 },
        errorMessage: 'Invalid Parameter Length: Gender'
      }
    },
    alias: {
      optional: true,
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Alias'
      }
    },
    age: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Age',
      isInt: {
        options: { min: 16 },
        errorMessage: 'Invalid Parameter: Age - Must be 16 +'
      },
      toInt: true
    },
    street: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Street',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Street'
      }
    },
    barangay: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Barangay',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Barangay'
      }
    },
    city: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: City',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: City'
      }
    },
    region: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Region',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Region'
      }
    },
    country: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Country',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Country'
      }
    },
    zip: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Zip',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Zip'
      }
    }
  };

  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'POST /api/reporters');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function updateUser (req, res, next) {
  const userId = req.user._id;
  const userData = req.body;
  const body = {
    fname: userData.fname,
    lname: userData.lname,
    email: userData.email,
    age: userData.age,
    gender: userData.gender,
    alias: userData.alias,
    street: userData.street,
    barangay: userData.barangay,
    city: userData.city,
    region: userData.region,
    country: userData.country,
    zip: userData.zip
  };
  req.$scope.userInput = body;
  return req.DB.User.findByIdAndUpdate(userId, body)
    .then((user) => {
      req.$scope.updatedUser = user;
      next();
    })
    .catch(err => internals.catchError(err, req, res));
}

function replicateChanges (req, res, next) {
  const body = req.$scope.userInput;
  const reporterID = req.user.reporterID;
  const reporter = body;
  reporter.reporterID = reporterID;
  return req.api.updateReporter(reporter)
    .then((result) => {
      req.$scope.reporter = result.reporter;
      return next();
    })
    .catch(error => internals.internals(error, req, res));
}

function respond (req, res) {
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
  };
  req.logger.info(result, 'PUT /api/auth/user');
  res.status(result.httpCode).send(result);
}

module.exports = {
  validateBody,
  logic: updateUser,
  replicateChanges,
  respond
};