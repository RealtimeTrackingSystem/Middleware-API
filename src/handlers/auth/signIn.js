

const lib = require('../../lib');
function logic (req, res) {
  const token = lib.crypto.encodeToken(req.user);
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    payload: {
      user: req.user,
      token: token
    }
  };
  req.logger.info(result, 'POST /api/auth/signin');
  res.status(result.httpCode).send(result);
}

function rehydrateCredentials (req, res) {
  const token = lib.crypto.encodeToken(req.user);
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    payload: {
      user: req.user,
      token: token
    }
  };
  req.logger.info(result, 'POST /api/auth/rehydrate');
  res.status(result.httpCode).send(result);
}

module.exports = {
  logic,
  rehydrateCredentials
};
