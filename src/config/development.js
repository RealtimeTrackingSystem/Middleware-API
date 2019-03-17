const CONFIG = {
  db: {
    HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: process.env.DB_PORT || '27017',
    DATABASE: process.env.DATABASE || 'middlewareApiDb2',
    MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD
  },
  LOG: {
    env: 'dev'
  },
  SALT: 10,
  SECRET_KEY: 'thesupersecretkey',
  SESSION_SECRET: 'superscretsession',
  SENDGRID: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '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',
    SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD || 'zlvmvall6181',
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME || 'app113302926@heroku.com'
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  REPORT_API_KEY: process.env.REPORT_API_KEY,
  REPORT_API_URL: process.env.REPORT_API_URL,
  REPORT_API_PORT: process.env.REPORT_API_PORT
};

module.exports = CONFIG;

/*
HOST: process.env.DB_HOST || '35.240.157.43',
    PORT: process.env.DB_PORT || '31000',
    DATABASE: process.env.DATABASE || 'middlewareApiDb',
*/
