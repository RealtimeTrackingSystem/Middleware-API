const CONFIG = {
  DATABASE: 'mongodb://localhost:27017/middlewareApiDb',
  LOG: {
    env: 'dev'
  },
  SALT: 10,
  SECRET_KEY: 'thesupersecretkey',
  SESSION_SECRET: 'superscretsession',
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
  REPORT_API_KEY: 'E520N822E85066R7K1W674K5Q0D4W851P2E9G4U5',
  REPORT_API_URL: 'http://127.0.0.1:5000'
};

module.exports = CONFIG;
