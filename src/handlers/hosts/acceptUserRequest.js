'use strict';

const _ = require('lodash');
const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    userId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: User ID',
      isLength: {
        options: { min: 10, max: 50 },
        errorMessage: 'Invalid Parameter Length: User ID'
      }
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'PUT /api/hosts/requests/:hostId');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function checkUser (req, res, next) {
  const hostId = req.params.hostId;
  const userId = req.body.userId;
  const isObjectId = lib.customValidators.isObjectId(userId);
  const error = {
    status: 'ERROR',
    statusCode: 2,
    httpCode: 400,
    message: 'Invalid Parameter: User ID'
  };
  if (!isObjectId) {
    req.logger.warn(error, 'PUT /api/hosts/requests/:hostId');
    return res.status(error.httpCode).send(error);
  }
  return req.DB.User.findById(userId)
    .then(function (user) {
      if (!user) {
        req.logger.warn(error, 'PUT /api/hosts/requests/:hostId');
        return res.status(error.httpCode).send(error);
      }
      const membership = _.find(user.hosts, h => {
        return h._id === hostId;
      });
      if (!membership) {
        req.logger.warn(error, 'PUT /api/hosts/requests/:hostId');
        return res.status(error.httpCode).send(error);
      }
      if (!membership.isBlocked) {
        return res.status(201).send({
          status: 'SUCCESS',
          statusCode: 0,
          httpCode: 201
        });
      }
      req.$scope.userToApprove = {
        accessLevel: user.accessLevel,
        _id: user._id,
        username: user.username,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        alias: user.alias,
        street: user.street,
        barangay: user.barangay,
        city: user.city,
        region: user.region,
        country: user.country,
        zip: user.zip,
        reporterID: user.reporterID
      };
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(err, 'POST /api/hosts/requests/:hostId');
      res.status(500).send(error);
    });
}

function logic (req, res, next) {
  const userId = req.body.userId;
  const hostId = req.params.hostId;
  const error = {
    status: 'ERROR',
    statusCode: 2,
    httpCode: 400,
    message: 'Invalid Parameter: User ID'
  };
  return req.DB.User.approveUserToHost(userId, hostId)
    .then(function (user) {
      if (!user) {
        req.logger.warn(error, 'PUT /api/hosts/requests/:hostId');
        return res.status(error.httpCode).send(error);
      }
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(err, 'POST /api/hosts/requests/:hostId');
      res.status(500).send(error);
    });
}

function sendNotification (req, res, next) {
  const userToApprove = req.$scope.userToApprove;
  const hostId = req.params.hostId;

  return req.Api.host.hostRequestApprovedNotif(hostId, userToApprove.reporterID)
    .then((result) => {
      req.logger.info(result, 'POST /api/hosts/requests/:hostId');
      next();
    })
    .catch((err) => {
      req.logger.error(err, 'POST /api/hosts/requests/:hostId');
      next();
    });

}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  req.logger.info(response, 'PUT /api/hosts/requests/:hostsId');
  res.status(201).send(response);
}

module.exports = {
  validateBody,
  checkUser,
  logic,
  sendNotification,
  respond
};
