
function logic (req, res, next) {
  const hostId = req.params.hostId;
  return req.api.host.approveHost(hostId)
    .then(response => {
      // req.logger.info(response, 'PUT /api/hosts/approval/:hostId');
      next();
    })
    .catch((result) => {
      const err = result.response.body;
      // req.logger.error(err, 'PUT /api/hosts/approval/:hostId');
      res.status(err.httpCode).send(err);
    });
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  // req.logger.info(response, 'PUT /api/hosts/approval/:hostId');
  res.status(response.httpCode).send(response);
}

module.exports = {
  logic,
  respond
};
