const CONFIG = {
  DATABASE: 'mongodb://localhost:27017/middlewareApiDb',
  LOG: {
    env: 'dev'
  },
  SALT: 10,
  SECRET_KEY: 'thesupersecretkey',
  SESSION_SECRET: 'superscretsession'
};

module.exports = CONFIG;
