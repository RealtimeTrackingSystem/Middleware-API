const CONFIG = {
  DATABASE: process.env.DATABASE || 'mongodb://localhost:27017/middlewareApiDbProd',
  LOG: {
    env: process.env.LOG_ENV || 'info'
  },
  SALT: process.env.SALT || 10,
  SECRET_KEY: process.env.SECRET_KEY || 'thesupersecretkey',
  SESSION_SECRET: process.env.SESSION_SECRET || 'superscretsession',
  SENDGRID: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD,
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET
  },
  REPORT_API_KEY: process.env.REPORT_API_KEY,
  REPORT_API_URL: process.env.REPORT_API_URL
};

module.exports = CONFIG;
