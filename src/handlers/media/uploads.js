const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const Promise = require('bluebird');

const config = require('../../config');
const CONFIG = config[process.env.NODE_ENV || 'development'];

cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY.CLOUD_NAME, 
  api_key: CONFIG.CLOUDINARY.API_KEY, 
  api_secret: CONFIG.CLOUDINARY.API_SECRET
});

function storage (folderName, allowedFormats = ['jpg', 'png']) {
  return cloudinaryStorage({
    cloudinary: cloudinary,
    folder: folderName,
    allowedFormats: allowedFormats,
    filename: function (req, file, cb) {
      const filename = file.originalname +'_'+ new Date();
      cb(undefined, filename);
    }
  });
}

function singleUpload (fieldName, folderName = 'public', allowedFormats = ['jpg', 'png']) {
  const upload = multer({ storage: storage(folderName, allowedFormats) });
  return upload.single(fieldName);
}

function multipleUpload (fieldName, numberOfFiles, folderName = 'public', allowedFormats = ['jpg', 'png'] ) {
  const upload = multer({ storage: storage(folderName, allowedFormats) });
  return upload.array(fieldName, numberOfFiles);
}

function destroyUploadedFiles (req, res, next) {
  const filesToDelete = req.$scope.filesToDelete;
  function deleteImg (public_id) {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(public_id, (error, result) => {
        let success = true;
        if (error) {
          success = false;
        }
        resolve({
          public_id: public_id,
          success: success,
          result: result || null
        });
      });
    });
  }
  if (filesToDelete && Array.isArray(filesToDelete) && filesToDelete.length > 0) {
    return Promise.map(req.files, file => deleteImg(file.public_id))
      .then(function (results) {
        req.$scope.deletedImages = results;
        res.end();
      })
      .catch(function (err) {
        next(err);
      });
  }
  next();
}

module.exports = {
  singleUpload: singleUpload,
  multipleUpload: multipleUpload,
  destroyUploadedFiles: destroyUploadedFiles
};
