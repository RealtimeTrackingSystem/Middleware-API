const lib = require('../../lib');

function logic (req, res) {
  const { reportId, note } = req.body;
  return req.api.report.addFileAction({ reportId, note })
    .then(function (result) {
      res.status(201).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201
      });
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('POST /api/reports/fileAction', error);
      if (error.response.body && error.response.body.httpCode) {
        return res.status(error.response.body.httpCode).send(error.response.body);
      }
      res.status(500).send(err);
    });
}

module.exports = {
  logic
};
