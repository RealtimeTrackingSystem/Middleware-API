const express = require('express');
const handlers = require('../handlers');

const hostRoute = express.Router();

hostRoute.post('/api/hosts/admin',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.authentication.checkHostAdminship,
  handlers.hosts.setAsAdmin.validateBody,
  handlers.hosts.setAsAdmin.logic);

hostRoute.get('/api/hosts/search-paginated/:searchString',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.searchHostPaginated.validateQuery,
  handlers.hosts.searchHostPaginated.logic);

hostRoute.put('/api/hosts/approval/:hostId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.authentication.checkUserAdminship,
  handlers.hosts.acceptNewHost.logic,
  handlers.hosts.acceptNewHost.respond);


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
  handlers.hosts.getUserRequests.checkHostAdminship,
  handlers.hosts.acceptUserRequest.validateBody,
  handlers.hosts.acceptUserRequest.checkUser,
  handlers.hosts.acceptUserRequest.logic,
  handlers.hosts.acceptUserRequest.sendNotification,
  handlers.hosts.acceptUserRequest.respond);

hostRoute.delete('/api/hosts/requests/:hostId/:userId',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.rejectHostRequest.checkHost,
  handlers.hosts.rejectHostRequest.rejectRequest,
  handlers.hosts.rejectHostRequest.sendNotif,
  handlers.hosts.rejectHostRequest.respond);

hostRoute.post('/api/hosts/invites',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.hosts.sendInvites.validateBody,
  handlers.hosts.sendInvites.addHostIdToScope,
  handlers.hosts.getUserRequests.checkHostAdminship,
  handlers.hosts.sendInvites.sendInvite,
  handlers.hosts.sendInvites.populateInvite,
  handlers.hosts.sendInvites.sendEmail,
  handlers.hosts.sendInvites.respond);

module.exports = hostRoute;
