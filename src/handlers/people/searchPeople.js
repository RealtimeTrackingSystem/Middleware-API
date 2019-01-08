const lib = require('../../lib');

function validateQuery (req, res, next) {
  const schema = {
    limit: {
      optional: true,
      isInt: {
        errorMessage: 'Invalid Parameter: Limit'
      }
    },
    page: {
      optional: true,
      isInt: {
        errorMessage: 'Invalid Parameter: Page'
      }
    },
    search: {
      optional: true
    },
    isCulprit: {
      optional: true
    }
  };
  req.checkQuery(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('GET /api/people', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res) {
  const { search, limit, page, isCulprit } = req.query;
  return req.api.people.getPeople(search, page, limit, { isCulprit })
    .then((response) => {
      const success = {
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200
      };
      req.logger.info(success, 'GET /api/people');
      success.people = response.people;
      success.count = response.count;
      res.status(200).send(success);
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(error, 'GET /api/people');
      return res.status(500).send(err);
    });
}

module.exports = {
  validateQuery,
  logic
};
