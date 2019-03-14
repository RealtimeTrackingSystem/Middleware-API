function logic (req, res, next) {
  const isDuplicate = req.query.isDuplicate;
  return req.api.report.getDuplicates(isDuplicate)
    .then(response => {
      req.$scope.reports = response.reports;
      next();
    })
    .catch(function (err) {
      if (err.httpCode) {
        // req.logger.warn(err, 'GET /api/reports/duplicates');
        return res.status(err.httpCode).send(err);
      }
      // req.logger.error(err, 'GET /api/reports/duplicates');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function respond (req, res) {
  // req.logger.info(req.$scope.report, 'GET /api/reports/duplicates');
  res.status(200).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    reports: req.$scope.reports
  });
}

module.exports = {
  logic,
  respond
};
