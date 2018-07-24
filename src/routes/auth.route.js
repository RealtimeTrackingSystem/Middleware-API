
const express = require('express');
const passport = require('passport');
require('../models/User');
require('../lib/passport');
const handlers = require('../handlers');
const requireSignin = passport.authenticate('local', { session: false });
const authRoute = express.Router();

authRoute.post('/api/auth/signin',
  requireSignin, handlers.auth.signIn.logic);

authRoute.post('/api/auth/signup',
  handlers.auth.signUp.validateParams,
  handlers.auth.signUp.checkDuplicateCredentials,
  handlers.auth.signUp.addUserToScope,
  handlers.auth.signUp.logic,
  handlers.auth.signUp.respond);

module.exports = authRoute;
