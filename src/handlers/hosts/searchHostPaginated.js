const lib = require('../../lib');

const internals = {};
internals.serverError = function (err, req, res) {
  req.logger.error(err, 'GET /api/hosts');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

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
    }
  };
  req.checkQuery(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('GET /api/hosts/search-paginated/:searchString', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res) {
  const { limit, page } = req.query;
  const searchString = req.params.searchString;
  return req.api.host.searchHostPaginated(searchString, page, limit)
    .then(response => {
      req.logger.info(response, 'GET /api/hosts/search-paginated/:searchString');
      res.status(response.httpCode).send(response);
    })
    .catch(result => {
      const err = result.response.body;
      req.logger.error(err, 'GET /api/hosts/search-paginated/:searchString');
      res.status(err.httpCode).send(err);
    });
}

module.exports = {
  validateQuery,
  logic
};
