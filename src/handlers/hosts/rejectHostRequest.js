const lib = require('../../lib');

function checkHost (req, res, next) {
  const hostId = req.params.hostId;
  return req.api.host.getHostById(hostId)
    .then(function (result) {
      if (!result.host) {
        const error = {
          status: 'ERROR',
          statusCode: 4,
          httpCode: 400,
          message: 'Host Not Found'
        };
        req.logger.warn(error, 'DELETE /api/hosts/requests/:hostId');
        return res.status(error.httpCode).send(error);
      }
      req.$scope.host = result.host;
      next();
    })
    .catch(function (result) {
      const err = result.response.body;
      req.logger.error(err, 'DELETE /api/hosts/requests/:hostId');
      res.status(err.httpCode).send(err);
    });
}

function rejectRequest (req, res, next) {
  const hostId = req.params.hostId;
  const userId = req.params.userId;
  return req.DB.User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: User Id'
        };
        return res.status(error.httpCode).send(error);
      }
      const hosts = user.hosts.filter((host) => {
        return host._id.toString() !== hostId;
      });
      return req.DB.User.findOneAndUpdate({
        _id: userId
      }, {
        hosts: hosts
      });
    })
    .then(function (result) {
      if (result.error) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: result.error
        };
        req.logger.warn(error, 'DELETE /api/hosts/requests/:hostId');
        return res.status(error.httpCode).send(error);
      }
      req.$scope.userData = result;
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(err, 'DELETE /api/hosts/requests/:hostId');
      res.status(500).send(error);
    });
}

function sendNotif (req, res, next) {
  const type = 'REJECT_REQUEST';
  const hostId = req.params;
  const userData = req.$scope.userData;
  return req.Api.host.hostRequestApprovedNotif(hostId, userData.reporterID, { type })
    .then((result) => {
      req.logger.info(result, 'DELTE /api/hosts/requests/:hostId');
      next();
    })
    .catch((err) => {
      req.logger.error(err, 'DELETE /api/hosts/requests/:hostId');
      next();
    });
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  req.logger.info(response, 'DELETE /api/hosts/requests/:hostsId');
  res.status(201).send(response);
}

module.exports = {
  checkHost,
  rejectRequest,
  sendNotif,
  respond
};
