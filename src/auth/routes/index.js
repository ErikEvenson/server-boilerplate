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
        console.log(req.method, req.path);
        if (req.method === 'GET' && req.path === '/api/v1/auth/registrations') {
          return res.status(403).send();
        }
        
        return next();
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
