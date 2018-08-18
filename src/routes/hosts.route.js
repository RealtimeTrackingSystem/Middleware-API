const express = require('express');
const handlers = require('../handlers');

const hostRoute = express.Router();

hostRoute.get('/api/hosts',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.getHosts.validateQuery,
  handlers.hosts.getHosts.logic,
  handlers.hosts.getHosts.respond);

hostRoute.post('/api/hosts',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.createHost.validateBody,
  handlers.hosts.createHost.logic,
  handlers.hosts.createHost.appendHostToUser,
  handlers.hosts.createHost.respond);

hostRoute.get('/api/hosts/:hostId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.getHostById.logic,
  handlers.hosts.getHostById.respond);

hostRoute.get('/api/hosts/requests/:hostId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.sendUserRequest.checkHost,
  handlers.hosts.getUserRequests.checkUserAdminship,
  handlers.hosts.getUserRequests.getUsers,
  handlers.hosts.getUserRequests.respond);

hostRoute.post('/api/hosts/requests/:hostId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.sendUserRequest.checkHost,
  handlers.hosts.sendUserRequest.sendRequest,
  handlers.hosts.sendUserRequest.respond);

hostRoute.put('/api/hosts/requests/:hostId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.sendUserRequest.checkHost,
  handlers.hosts.getUserRequests.checkUserAdminship,
  handlers.hosts.acceptUserRequest.validateBody,
  handlers.hosts.acceptUserRequest.checkUser,
  handlers.hosts.acceptUserRequest.logic,
  handlers.hosts.acceptUserRequest.respond);

module.exports = hostRoute;
