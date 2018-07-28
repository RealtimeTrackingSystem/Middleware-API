
const passport = require('passport');
require('../../models');
require('../../lib/passport');
const requireAuth = passport.authenticate('jwt', {session: false, failWithError: true});


function authenticate (err, req, res, next) {
  if (err) {
    const error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 401,
      message: 'Unauthorized User'
    };
    req.logger.warn('passport-auth', err, error);
    return res.status(401).send(error);
  }
  next();
}

module.exports = {
  requireAuth,
  authenticate
};
