function checkProfilePic (req, res, next) {
  let file;
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    file = req.files[0];
  }

  if (req.body.file) {
    file = req.body.file;
  }

  if (!file) {
    const error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Missing Parameter: Profile Picture'
    };
    req.logger.warn(error, 'PUT /api/auth/profilepic');
    return res.status(error.httpCode).send(error);
  }

  req.$scope.media = {
    platform: 'cloudinary',
    metaData: file
  };
  next();
}

function logic (req, res, next) {
  const media = req.$scope.media;
  const user = req.user;
  return req.DB.Picture.add(media)
    .then((picture) => {
      return req.DB.User.findByIdAndUpdate(user._id, {
        profilePicture: picture._id
      });
    })
    .then(() => {
      next();
    })
    .catch((err) => {
      console.log(err);
      const error = {
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      };
      req.logger.error(err, 'PUT /api/auth/profilepic');
      res.status(error.httpCode).send(error);
    });
}

function replicateReporter (req, res, next) {
  const reporterId = req.user.reporterID;
  const file = req.$scope.media;
  return req.api.reporter.updateReporterProfilePic(reporterId, file)
    .then((result) => {
      next();
    })
    .catch((err) => {
      console.log(err);
      const error = {
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      };
      req.logger.error(err, 'PUT /api/auth/profilepic');
      res.status(error.httpCode).send(error);
    });
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  req.logger.info(response, 'PUT /api/auth/profilepic/:reporterId');
  res.status(response.httpCode).send(response);
}

module.exports = {
  checkProfilePic,
  logic,
  replicateReporter,
  respond
};
