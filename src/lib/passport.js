

const passport = require('passport');


const CONFIG = require('../config');
const localOptions = { usernameField: 'loginName'};
const config = CONFIG[process.env.NODE_ENV || 'development'];
const DB = require('../models');
const lib = require('../lib');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const Promise = require('bluebird');


const localLogin = new LocalStrategy(localOptions, function (loginName, password, done) {
  const checkUser = DB.User.findByUsernameOrEmail(loginName);
  const checkPassword = checkUser.then(function (user) {
    if (!user) {
      return Promise.resolve(false);
    } else {
      return lib.crypto.compareHash(password, user.password);
    }
  });
  const checkUserWithoutPw = DB.User.findByUsernameOrEmail(loginName)
    .populate('profilePicture')
    .select('-password');
  return Promise.all([checkUserWithoutPw, checkPassword])
    .then(function ([userWOP, isMatch]) {
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, userWOP);
    })
    .catch(function (err) {
      lib.logger.error('signingup', err);
      return done(err);
    });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.SECRET_KEY
};

const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  return DB.User.findById(payload._id)
    .populate('profilePicture')
    .select('-password')
    .then(function (user) {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(function (err) {
      lib.logger.error(err, 'jwt-authorization');
      return done(err);
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
