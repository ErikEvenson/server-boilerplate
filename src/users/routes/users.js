var
  express = require('express'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose'),
  usersController = require('../controllers/users');

var authRoutes = express.Router();
var apiRoutes = express.Router();

module.exports = function(app) {
  authRoutes.use(function(req, res, next) {
    console.log("XXXX");

    var token = (
      req.body.token || req.query.token || req.headers['x-access-token']
    );

    if (token) {
      jwt.verify(
        token,
        req.app.get('secrets').tokenSecret,
        function(err, decoded) {
          if (err) {
            return res.status(403).json({
              success: false,
              message: 'Failed to authenticate token.'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        }
      );
    } else {
      return res.status(401).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  app.use('/api', authRoutes);

  app.route('/authenticate')
    .post(usersController.authenticate);

  // API routes
  restify.serve(apiRoutes, mongoose.model('User'), {
    idProperty: 'username',
    lowercase: true,
    strict: true
  });

  app.use(apiRoutes);
};
