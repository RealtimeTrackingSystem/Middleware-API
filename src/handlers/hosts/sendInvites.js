'use strict';

const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    hostId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Host ID'
    },
    userId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: User ID'
    },
    inviteAs: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Invite As'
    }
  };

  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn(errorObject, 'POST /api/hosts/sendInvites');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function addHostIdToScope (req, res, next) {
  req.$scope.hostId = req.body.hostId;
  next();
}

function sendInvite (req, res, next) {
  const hostId = req.body.hostId;
  const userId = req.body.userId;
  const inviteAs = req.body.inviteAs;

  const newInvite = {
    type: 'HOST',
    refId: hostId,
    invitor: req.user._id,
    invitee: userId,
    as: inviteAs
  };
  return req.DB.Invite.add(newInvite)
    .then(function (invite) {
      req.$scope.newInvite = invite;
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      // req.logger.error(err, 'POST /api/hosts/invites');
      res.status(500).send(error);
    });
}

function populateInvite (req, res, next) {
  const invite = req.$scope.newInvite;
  const invitee = req.DB.User.findById(invite.invitee).select('-password -hosts').exec();
  const invitor = req.DB.User.findById(invite.invitor).select('-password -hosts').exec();
  return Promise.all([invitee, invitor])
    .then(function (results) {
      req.$scope.invitee = results[0];
      req.$scope.invitor = results[1];
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      // req.logger.error(err, 'POST /api/hosts/invites');
      res.status(500).send(error);
    });
}

// @TODO: send email
function sendEmail (req, res, next) {
  next();
}

function respond (req, res) {
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  // req.logger.info(result, 'POST /api/hosts/invites');
  res.status(result.httpCode).send(result);
}

module.exports = {
  validateBody,
  addHostIdToScope,
  sendInvite,
  populateInvite,
  sendEmail,
  respond
};
