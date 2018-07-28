const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    title: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Title',
      isLength: {
        options: { max: 20 },
        errorMessage: 'Invalid Parameter Length: Title'
      }
    },
    description: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Description',
      isLength: {
        options: { max: 255 },
        errorMessage: 'Invalid Parameter Length: Description'
      }
    },
    location: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Location',
      isLength: {
        options: { max: 255 },
        errorMessage: 'Invalid Parameter Length: Location'
      }
    },
    long: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Longitude',
      isInt: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter Length: Longitude'
      }
    },
    lat: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Latitude',
      isInt: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter Length: Latitude'
      }
    },
    people: {
      optional: true,
      errorMessage: 'Missing Parameter: People',
      isArray: {
        errorMessage: 'Invalid Parameter: People'
      }
    },
    properties: {
      optional: true,
      errorMessage: 'Missing Parameter: Properties',
      isArray: {
        errorMessage: 'Invalid Parameter: Properties'
      }
    },
    medias: {
      optional: true,
      errorMessage: 'Missing Parameter: Medias',
      isArray: {
        errorMessage: 'Invalid Parameter: Medias'
      }
    },
    tags: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Tags',
      isArray: {
        errorMessage: 'Invalid Parameter: Tags'
      }
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('POST /api/reports', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }

}

function sendReport (req, res, next) {
  return req.api.report.createReport(req.body)
    .then(function (report) {
      req.$scope.report = report;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('POST /api/reports', error);
      return res.status(500).send(err);
    });
}

function respond (req, res) {
  const report = req.$scope.report;
  req.logger.info('POST /api/reports', report);
  res.status(201).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  });
}

module.exports = {
  validateBody,
  sendReport,
  respond
};
