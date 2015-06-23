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
  restify.serve(apiRoutes, mongoose.model('User'), {
    access: function(req) {
      return 'public';
    },
    contextFilter: function(model, req, cb) {
      cb(model.find({}, {
        registrationToken: true
      }));
    },
    idProperty: 'registrationToken',
    lowercase: true,
    middleware: [
      // Prevent listing users
      function(req, res, next) {
        if (req.method === 'GET') {
          if (req.path === '/api/v1/auth/registrations') {
            return res.status(403).send();
          } else {
            var registrationToken = req.params.id;

            mongoose.model('User')
              .findOne({registrationToken: registrationToken}, function(err, user) {
                user.isActive = true;
                user.save().then(function(err) {
                  return next();
                });
              });
          }
        } else {
          return res.status(403).send();  
        }
      }
    ],
    name: 'auth/registrations',
    prereq: function(req) {
      // Prevent POST, PUT, DELETE
      return false;
    },
    private: '_id',
    protected: '_id',
    strict: true
  });

  app.use(apiRoutes);
};
