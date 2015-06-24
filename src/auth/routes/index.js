var
  authController = require('../controllers'),
  express = require('express'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose'),
  uuid = require('uuid');

var authRoutes = express.Router();
var apiRoutes = express.Router();

module.exports = function(app) {
  // Authenticate  
  app.route('/authenticate')
    .post(authController.authenticate);

  // API routes
  restify.serve(apiRoutes, mongoose.model('Registration'), {
    access: function(req) {
      return 'public';
    },
    idProperty: 'token',
    lowercase: true,
    middleware: [
      // Prevent listing users
      function(req, res, next) {
        if (req.method === 'GET') {
          if (req.path === '/api/v1/auth/registrations') {
            return res.status(403).send();
          } else {
            return next();
          }
        } else if (req.method === 'POST') {
          if (req.path === '/api/v1/auth/registrations') {
            return next();
          } else {
            return next();
          }
        } else {
          return res.status(403).send();  
        }
      }
    ],
    name: 'auth/registrations',
    prereq: function(req) {
      return true;
    },
    private: '_id,created,token,__v',
    protected: '_id,created,token,__v',
    strict: true
  });

  app.use(apiRoutes);
};
