/**
 * @param {Object} req - Request.
 * @param {Object} res - Response.
 */

exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }

  next();
};
