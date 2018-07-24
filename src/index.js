

const mongoose = require('mongoose');
const DB = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const validator = require('express-validator');
const morgan = require('morgan');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const CONFIG = require('./config');
const lib = require('./lib');

// set up express app
const app = express();
const config = CONFIG[process.env.NODE_ENV || 'development'];

// connect MongoDB
mongoose.connect(config.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 3000;

app.DB = DB;

app.use(logger(config.LOG.env));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));

// Cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// passport
app.use(passport.initialize());
app.use(passport.session());

// express-validator
app.use(validator({
  customValidators: lib.customValidators
}));

// adding req variables
app.use(function (req, res, next) {
  req.logger = {};
  req.logger = lib.logger;
  req.$scope = {};
  req.DB = DB;
  next();
});



// initialize routes
routes(app);

// listen for requests
app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

module.exports = app;
