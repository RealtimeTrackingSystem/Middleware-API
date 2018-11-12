function validateParams (req, res, next) {
  // reportUpdates is an array of
  // { reportId: '', status: '' }
  const reportUpdates = req.body.reportUpdates;
  let error;
  if (!reportUpdates) {
    error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Missing Parameter: Report Updates'
    };
  } else if (!Array.isArray(reportUpdates) || reportUpdates.length < 1) {
    error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Report Updates'
    };
  } else {
    error = null;
  }

  if (error) {
    req.logger.warn(error, 'POST /api/v1/reports/mass-update-status');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function logic (req, res) {
  const reportUpdates = req.body.reportUpdates;
  return req.api.report.massStatusUpdate(reportUpdates)
    .then(response => {
      req.logger.info(response, 'POST /api/v1/reports/mass-update-status');
      res.status(response.httpCode).send(response);
    })
    .catch(function (err) {
      if (err.httpCode) {
        req.logger.warn(err, 'POST /api/v1/reports/mass-update-status');
        return res.status(err.httpCode).send(err);
      }
      req.logger.error(err, 'POST /api/v1/reports/mass-update-status');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

module.exports = {
  validateParams,
  logic
};
