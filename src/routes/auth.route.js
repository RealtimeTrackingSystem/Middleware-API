
const express = require('express');
const passport = require('passport');
require('../models');
require('../lib/passport');
const handlers = require('../handlers');
const requireSignin = passport.authenticate('local', { session: false });
const authRoute = express.Router();

authRoute.post('/api/auth/signin',
  requireSignin,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.signIn.logic);

authRoute.post('/api/auth/signup',
  handlers.auth.signUp.validateParams,
  handlers.auth.signUp.checkDuplicateCredentials,
  handlers.auth.signUp.addUserToScope,
  handlers.auth.signUp.logic,
  handlers.auth.signUp.replicateUser,
  handlers.auth.signUp.appendReporterId,
  handlers.auth.signUp.respond);

authRoute.get('/api/auth/rehydrate',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.signIn.rehydrateCredentials);

authRoute.put('/api/auth/password',
  handlers.auth.authentication.requireAuth,
  handlers.auth.authentication.authenticate,
  handlers.auth.authentication.logActivity,
  handlers.auth.updatePassword.validateBody,
  handlers.auth.updatePassword.logic,
  handlers.auth.updatePassword.respond);

authRoute.post('/api/auth/password',
  handlers.auth.forgotPassword.validateBody,
  handlers.auth.forgotPassword.checkUserEmail,
  handlers.auth.forgotPassword.logic,
  handlers.auth.forgotPassword.sendEmail,
  handlers.auth.forgotPassword.respond);

module.exports = authRoute;
