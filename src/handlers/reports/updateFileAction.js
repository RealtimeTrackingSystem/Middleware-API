const lib = require('../../lib');

function logic (req, res) {
  const fileActionId = req.params.fileActionId;
  const { note } = req.body;
  return req.api.report.updateFileAction(fileActionId, note)
    .then(function (result) {
      res.status(201).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201
      });
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('PUT /api/people/fileActions/:fileActionId', error);
      if (error.response.body && error.response.body.httpCode) {
        return res.status(error.response.body.httpCode).send(error.response.body);
      }
      res.status(500).send(err);
    });
}

module.exports = {
  logic
};
