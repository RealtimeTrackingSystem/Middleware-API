
function routes (app) {
  app.get('/echo', function (req, res) {
    const success = {
      status: 'SUCCESS',
      statusCode: 0,
      httpCode: 200,
      message: 'MIDDLEWARE API is online!'
    };
    req.logger.info(success, 'GET /echo');
    res.status(200).send(success);
  });
  app.use(require('./auth.route'));
  app.use(require('./reports.route'));
  app.use(require('./hosts.route'));
  app.use(require('./reporters.route'));
  app.use(require('./people.route'));
  app.use('*', function (req, res){
    const path = req.params['0'];
    const message = `${path} is not a valid path`;
    const error = {
      status: 'ERROR',
      statusCode: 4,
      httpCode: 404,
      message: message
    };
    req.logger.warn(error, path);
    res.status(404).send(error);
  });
}

module.exports = routes;
