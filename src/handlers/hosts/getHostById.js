'use strict';

function logic (req, res, next) {
  const hostId = req.params.hostId;
  return req.api.host.getHostById(hostId)
    .then(function (response) {
      req.$scope.result = response;
      next();
    })
    .catch(function (result) {
      const err = result.response.body;
      // req.logger.error(err, 'GET /api/hosts/:hostId');
      res.status(err.httpCode).send(err);
    });
}

function respond (req, res) {
  const result = req.$scope.result;
  // req.logger.info(result, 'GET /api/hosts/:hostId');
  res.status(result.httpCode).send(result);
}

module.exports = {
  logic,
  respond
};
