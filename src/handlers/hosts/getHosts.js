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
    filter: {
      optional: true
    }
  };
  req.checkQuery(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('GET /api/reports', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res, next) {
  const page = req.query.page;
  const limit = req.query.limit;
  const filter = req.query.filter || null;
  return req.api.host.getHosts(page, limit, filter)
    .then(function (result) {
      req.$scope.result = result;
      next();
    })
    .catch(function (result) {
      const err = result.response.body;
      req.logger.error(err, 'GET /api/hosts');
      res.status(err.httpCode).send(err);
    });
}

function respond (req, res) {
  const result = req.$scope.result;
  req.logger.info(result, 'GET /api/hosts');
  res.status(result.httpCode).send(result);
}

module.exports = {
  validateQuery,
  logic,
  respond
};
