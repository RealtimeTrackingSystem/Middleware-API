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
      isNumber: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter Length: Longitude'
      }
    },
    lat: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Latitude',
      isNumber: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter Length: Latitude'
      }
    },
    hostId: {
      notEmpty: false,
      isLength: {
        options: { max: 255 },
        errorMessage: 'Invalid Parameter Length: Host ID'
      }
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  req.body.reporterID = req.user.reporterID;
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('POST /api/reports', errorObject);
    req.$scope.filesToDelete = req.files;
    res.status(errorObject.httpCode).send(errorObject);
    return next();
  } else {
    return next();
  }

}

function processTags (req, res, next) {
  const tags = req.body.tags;
  if (!Array.isArray(tags)) {
    req.body.tags = tags.split(',');
  }
  next();
}

function processMediaUploads (req, res, next) {
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const mediaUploads = req.files.map((file) => ({
      platform: 'cloudinary',
      metaData: file
    }));
    req.body.medias = mediaUploads;
  }
  next();
}

function processPeopleAndProperties (req, res, next) {
  const people = req.body.people;
  const properties = req.body.properties;
  try {
    if (typeof people == 'string') {
      req.body.people = JSON.parse(people);
    }
  }
  catch (e) {
    return res.status(400).send({
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Invalid Resource: People -> Invalid JSON String'
    });
  }
  try {
    if (typeof properties == 'string') {
      req.body.properties = JSON.parse(properties);
    }
  } catch (e) {
    return res.status(400).send({
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Invalid Resource: People -> Invalid JSON String'
    });
  }
  next();
}

function sendReport (req, res, next) {
  req.body.reporterId = req.user.reporterID;
  return req.api.report.createReport(req.body)
    .then(function (report) {
      req.$scope.report = report;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('POST /api/reports', error);
      if (error.response.body && error.response.body.httpCode) {
        res.status(error.response.body.httpCode).send(error.response.body);
      }
      req.$scope.filesToDelete = req.files;
      res.status(500).send(err);
      next();
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
  processTags,
  processMediaUploads,
  processPeopleAndProperties,
  sendReport,
  respond
};
