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
  const hostId = req.params.hostId;
  const { limit, page } = req.query;
  return req.DB.User.findMembers(hostId, page, limit)
    .then((result) => {
      req.logger.info(result, 'GET /api/host-members/:hostId');
      const response = {
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200,
        members: result.members,
        count: result.count
      };
      res.status(response.httpCode).send(response);
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(error, 'GET /api/host-members/:hostId');
      return res.status(500).send(err);
    });
}

module.exports = {
  validateQuery,
  logic
};
