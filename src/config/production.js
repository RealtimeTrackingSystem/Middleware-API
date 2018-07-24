const CONFIG = {
  DATABASE: process.env.DATABASE || 'mongodb://localhost:27017/middlewareApiDbProd',
  LOG: {
    env: process.env.LOG_ENV || 'prod'
  },
  SALT: process.env.SALT || 10,
  SECRET_KEY: process.env.SECRET_KEY || 'thesupersecretkey',
  SESSION_SECRET: process.env.SESSION_SECRET || 'superscretsession'
};

module.exports = CONFIG;
