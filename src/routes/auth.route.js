
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

module.exports = authRoute;
