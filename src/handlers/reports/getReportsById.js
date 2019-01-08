
const lib = require('../../lib');

function validateParams (req, res, next) {
  const reportId = req.params.reportId;
  const validObjectId = lib.customValidators.isObjectId(reportId);
  if (!validObjectId) {
    const error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Invalid Parameter: Report ID'
    };
    req.logger.warn(error, 'GET /api/reports/:reporterId');
    return res.status(error.httpCode).send(error);
  }
  next();
}
function logic (req, res, next) {
  const reportId = req.params.reportId;
  const resources = req.query.resources;
  return req.api.report.getReportById(reportId, resources)
    .then(function (response) {
      req.$scope.report = response.report;
      next();
    })
    .catch(function (err) {
      if (err.httpCode) {
        return res.status(err.httpCode).send(err);
      }
      req.logger.error(err, 'GET /api/reports/:reportId');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function populateUser (req, res, next) {
  const report = req.$scope.report;
  const reporterId = report._reporter && report._reporter._id ? report._reporter._id : report._reporter;
  return req.DB.User.findOne({
    reporterID: reporterId
  })
    .select('-password')
    .then((user) => {
      report.user = user;
      req.$scope.report = report;
      next();
    })
    .catch((err) => {
      req.logger.warn(err, 'GET /api/reports/:reportId');
      report.user = null;
      req.$scope.report = report;
      next();
    });
}

function respond (req, res) {
  req.logger.info(req.$scope.report, 'GET /api/reports/:reportId');
  res.status(200).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    report: req.$scope.report
  });
}

module.exports = {
  validateParams,
  logic,
  populateUser,
  respond
};
