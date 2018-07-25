const CONFIG = {
  DATABASE: process.env.DATABASE || 'mongodb://localhost:27017/middlewareApiDbProd',
  LOG: {
    env: process.env.LOG_ENV || 'prod'
  },
  SALT: process.env.SALT || 10,
  SECRET_KEY: process.env.SECRET_KEY || 'thesupersecretkey',
  SESSION_SECRET: process.env.SESSION_SECRET || 'superscretsession',
  SENDGRID: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD,
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME
  }
};

module.exports = CONFIG;
