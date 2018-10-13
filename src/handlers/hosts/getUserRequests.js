'use strict';

const _ = require('lodash');
const lib = require('../../lib');

function checkUserAdminship (req, res, next) {
  const user = req.user;
  const hostId = req.params.hostId || req.$scope.hostId;
  const userHost = _.find(user.hosts, h => {
    return h._id === hostId;
  });
  const error = {
    status: 'ERROR',
    statusCode: 3,
    httpCode: 400,
    message: 'User Not a Host Admin'
  };
  if (!userHost) {
    req.logger.warn(error, 'GET /api/hosts/request/:hostId');
    return res.status(error.httpCode).send(error);
  }
  const isHostAdmin = userHost.isAdmin;
  if (!isHostAdmin) {
    req.logger.warn(error, 'GET /api/hosts/request/:hostId');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function getUsers (req, res, next) {
  const hostId = req.params.hostId;
  const page = req.query.page || 0;
  const limit = req.query.limit || 10;
  return req.DB.User.getUserRequest(hostId, page, limit)
    .then(function (users){
      const trimmedUsers =  users.map(u => ({
        accessLevel: u.accessLevel,
        _id: u._id,
        username: u.username,
        email: u.email,
        fname: u.fname,
        lname: u.lname,
        alias: u.alias,
        street: u.street,
        barangay: u.barangay,
        city: u.city,
        region: u.region,
        country: u.country,
        zip: u.zip,
        reporterID: u.reporterID,
        createdAt: u.cratedAt,
        updatedAt: u.updatedAt
      }));
      req.$scope.users = trimmedUsers;
      return req.DB.User.getUserRequestCount(hostId);
    })
    .then(function (count) {
      req.$scope.count = count;
      next();
    })
    .catch(function (err) {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(err, 'POST /api/hosts/requests/:hostId');
      res.status(500).send(error);
    });
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    users: req.$scope.users,
    count: req.$scope.count
  };
  req.logger.info(response, 'GET /api/hosts/requests/:hostsId');
  res.status(200).send(response);
}

module.exports = {
  checkUserAdminship,
  getUsers,
  respond
};
