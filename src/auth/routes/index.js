var
  authController = require('../controllers'),
  express = require('express'),
  jwt = require('jsonwebtoken'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose'),
  uuid = require('uuid');

var authRoutes = express.Router();
var apiRoutes = express.Router();
var User = mongoose.model('User');

module.exports = function(app) {
  var environment = app.get('environment');

  var apiPrefix = environment.apiPrefix;
  var apiVersion = environment.apiVersion;
  var brand = environment.brand;
  var hostname = environment.hostname;
  var name = 'auth/registrations';

  var endpoint = apiPrefix + apiVersion + '/' + name;

  var apiAuth = function(req, res, next) {
    // Exceptions
    // Allow unauth new inactive user POST
    if (
      req.method === 'POST' 
      && req.path === endpoint 
    ) return next();

    // All GETting of single registration but not list
    if (
      req.method === 'GET'
      && req.path !== endpoint
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
  }

  var registerUser = function(result, done) {
    if (result.username) {
      User.findOne({username: result.username}, function(err, user) {
        if (err) done(err);

        if (user && user.email) {
          var options = {
            brand: brand,
            hostname: hostname,
            to: user.email,
            subject: 'Registration on ' + brand,
            path: endpoint +'/' + result.token,
            username: result.username
          }

          if (hostname === 'localhost') {
            options.protocol = 'http';
            options.port = '3000';

            app.mailer.render(
              'auth.registration.jade',
              options,
              function(err, message) {
                if (err) {
                  console.log(err);
                  return done(err);
                }
                
                console.log(message);
                return done();
              }
            );
          } else {
            options.protocol = 'https';
            options.port = null;

            app.mailer.send(
              'auth.registration.jade',
              options,
              function(err, message) {
                if (err) {
                  console.log(err);
                  return done(err);
                }
                
                return done();
              }
            );            
          }
        } else {
          return done();
        }
      });
    }
  };

  // Authenticate  
  app.route('/authenticate')
    .post(authController.authenticate);

  // Activate
  app.route(endpoint + '/:token/activate')
    .post(authController.activate);

  // API routes
  restify.serve(apiRoutes, mongoose.model('Registration'), {
    access: function(req) {
      return 'public';
    },
    idProperty: 'token',
    lowercase: true,
    middleware: [apiAuth],
    name: 'auth/registrations',
    // Remove all bodies for non-GET
    outputFn: function(req, res, data) {
      if (data.result !== null && req.method === 'GET') {
          res.status(data.statusCode || 200).json(data.result);
      } else {
          res.status(data.statusCode || 200).end();
      }
    },
    postCreate: function(res, result, done) {
      registerUser(result, done);
    },
    private: '_id,created,__v',
    protected: '_id,created,__v',
    strict: true
  });

  app.use(apiRoutes);
};
