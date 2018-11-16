
const passport = require('passport');
require('../../models');
require('../../lib/passport');
const requireAuth = passport.authenticate('jwt', {session: false, failWithError: true});


function authenticate (err, req, res, next) {
  console.log(err);
  if (err) {
    const error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 401,
      message: 'Unauthorized User'
    };
    req.logger.warn(error, 'passport-auth');
    return res.status(401).send(error);
  }
  next();
}

function logActivity (req, res, next) {
  const user = req.user;
  const url = req.url;
  const method = req.method;
  req.logger.info({
    user: user,
    url: url,
    method: method
  }, `User ID: ${user._id} is accessing ${method} ${url}`);
  next();
}

function adminOnly (req, res, next) {
  const user = req.user;
  const url = req.url;
  const method = req.method;
  if (!user.accessLevel || user.accessLevel !== 'ADMIN') {
    const error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 401,
      message: 'User Not Allowed'
    };
    req.logger.warn(error, `USER ID: ${user._id} not allowed to access ${method} ${url}`);
    return res.status(error.httpCode).send(error);
  }
  next();
}

function checkHostAdminship (req, res, next) {
  const user = req.user;
  const url = req.url;
  const method = req.method;
  if (!user.hosts[0] || !user.hosts[0].isAdmin) {
    const error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 401,
      message: 'User Not Allowed'
    };
    req.logger.warn(error, `USER ID: ${user._id} not allowed to access ${method} ${url}`);
    return res.status(error.httpCode).send(error);
  }
  next();
}

module.exports = {
  requireAuth,
  authenticate,
  adminOnly,
  checkHostAdminship,
  logActivity
};
