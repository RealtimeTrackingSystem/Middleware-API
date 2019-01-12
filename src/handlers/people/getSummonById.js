const lib = require('../../lib');

function logic (req, res) {
  const summonId = req.params.summonId;
  return req.api.people.getSummonById(summonId)
    .then(function (result) {
      res.status(200).send(result);
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('GET /api/people/summons/:summonId', error);
      if (error.response.body && error.response.body.httpCode) {
        return res.status(error.response.body.httpCode).send(error.response.body);
      }
      res.status(500).send(err);
    });
}

module.exports = {
  logic
};
