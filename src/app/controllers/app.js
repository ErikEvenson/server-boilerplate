/**
 * @param {Object} req - Request.
 * @param {Object} res - Response.
 */

exports.render = function(req, res) {
  req.session.lastVisit = new Date();

  res.render('app.index.jade', {
    title: 'Hello World',
    user: JSON.stringify(req.user)
  });
};

exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }

  next();
};
