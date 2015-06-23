var
  express = require('express'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose'),
  uuid = require('uuid');

var authRoutes = express.Router();
var apiRoutes = express.Router();

module.exports = function(app) {
  

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
        if (req.method === 'GET' && req.path === '/api/v1/auth/registrations') {
          return res.status(403).send();
        }
        
        return next();
      }
    ],
    name: 'auth/registrations',
    postProcess: function(req, res, next) {
      if (req.method === 'GET') {
        var registrationToken = req.params.id;

        mongoose.model('User')
          .findOne({registrationToken: registrationToken}, function(err, user) {
            user.isActive = true;
            user.registrationToken = null;
            user.save().then(function() {
              return next();              
            })
          });
      } else {
        return next();
      }
    },
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
