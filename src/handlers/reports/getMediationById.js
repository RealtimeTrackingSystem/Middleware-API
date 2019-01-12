const lib = require('../../lib');


function logic (req, res) {
  const mediationNoteId = req.params.mediationNoteId;
  return req.api.report.getMediationNoteById(mediationNoteId)
    .then(function (result) {
      res.status(200).send(result);
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('POST /api/people/summons', error);
      if (error.response.body && error.response.body.httpCode) {
        return res.status(error.response.body.httpCode).send(error.response.body);
      }
      res.status(500).send(err);
    });
}

module.exports = {
  logic
};
