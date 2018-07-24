

const lib = require('../../lib');
function logic (req, res) {
  const token = lib.crypto.encodeToken(req.user);
  req.logger.info('POST /api/auth/signin', {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    token: token
  });
  res.status(200).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    token: token
  });
}

module.exports = {
  logic
};
