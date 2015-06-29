var
  _ = require('lodash'),
  express = require('express'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose');
  // usersController = require('../controllers/users');

var apiRoutes = express.Router();
var authRoutes = express.Router();

var apiAuth = function(req, res, next) {
  // Exceptions
  // Allow unauth new inactive user POST
  if (
    req.method === 'POST' &&
    req.path === '/api/v1/users' &&
    _.has(req.body, 'isActive') &&
    !req.body.isActive
  ) return next();

  // All GETting of single user (ex for remote validation) but not list
  if (
    req.method === 'GET' &&
    req.path !== '/api/v1/users'
  ) return next();

  // Normal routes
  var token = (
    req.body.token || req.query.token || req.headers['x-access-token']
  );

  if (token) {
    jwt.verify(
      token,
      req.app.get('configVars').TOKEN_SECRET,
      function(err, decoded) {
        if (err) {
          return res.status(403).json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          req.decoded = decoded;
          return next();
        }
      }
    );
  } else {
    return res.status(401).send({
      success: false,
      message: 'No token provided.'
    });
  }
};

module.exports = function(app) {
  // API routes
  restify.serve(apiRoutes, mongoose.model('User'), {
    access: function(req) {
      return 'public';
    },
    contextFilter: function(model, req, cb) {
      cb(model.find({
      }, {
        _id: false,
        username: true
      }));
    },
    idProperty: 'username',
    lowercase: true,
    middleware: [apiAuth],
    // Remove all bodies for non-GET
    outputFn: function(req, res, data) {
        if (data.result !== null && req.method === 'GET') {
            res.status(data.statusCode || 200).json(data.result);
        } else {
            res.status(data.statusCode || 200).end();
        }
    },
    strict: true
  });

  app.use(apiRoutes);
};
