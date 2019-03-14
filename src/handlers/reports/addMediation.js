const lib = require('../../lib');


function processMedia (req, res, next) {
  if (!req.files || req.files.length < 1) next();
  const media = {
    platform: 'cloudinary',
    metaData: req.files[0]
  };
  req.$scope.media = media;
  next();
}

function logic (req, res) {
  const media = req.$scope.media;
  const { reportId, note, reporterId} = req.body;
  return req.api.report.addMediationNote({ reportId, note, reporterId, media })
    .then(function (result) {
      res.status(201).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201
      });
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      // req.logger.error('POST /api/people/summons', error);
      if (error.response.body && error.response.body.httpCode) {
        return res.status(error.response.body.httpCode).send(error.response.body);
      }
      res.status(500).send(err);
    });
}

module.exports = {
  processMedia,
  logic
};
