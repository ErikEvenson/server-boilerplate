var
  _ = require('lodash'),
  express = require('express'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose');
  // usersController = require('../controllers/users');

var authRoutes = express.Router();
var apiRoutes = express.Router();

module.exports = function(app) {
  // authRoutes.use(function(req, res, next) {
  //   var token = (
  //     req.body.token || req.query.token || req.headers['x-access-token']
  //   );

  //   if (token) {
  //     jwt.verify(
  //       token,
  //       req.app.get('secrets').tokenSecret,
  //       function(err, decoded) {
  //         if (err) {
  //           return res.status(403).json({
  //             success: false,
  //             message: 'Failed to authenticate token.'
  //           });
  //         } else {
  //           req.decoded = decoded;
  //           next();
  //         }
  //       }
  //     );
  //   } else {
  //     return res.status(401).send({
  //       success: false,
  //       message: 'No token provided.'
  //     });
  //   }
  // });

  // app.use('/api', authRoutes);

  // app.route('/authenticate')
  //   .post(usersController.authenticate);

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
    middleware: [
      // Prevent listing users
      function(req, res, next) {
        console.log(req.method, req.path);
        if (req.method === 'GET' && req.path === '/api/v1/users') {
          return res.status(403).send();
        }
        
        return next();
      }
    ],
    outputFn: function(req, res, data) {
        if (data.result !== null && req.method === 'GET') {
            res.status(data.statusCode || 200).json(data.result);
        } else {
            res.status(data.statusCode || 200).end();
        }
    },
    prereq: function(req) {
      // Allow registrations to POST inactive users
      if (
        _.has(req.body, 'isActive') &&
        !req.body.isActive &&
        req.method === 'POST'
      ) {
        return true;
      }

      // Prevent everything else
      return false;
    },
    strict: true
  });

  app.use(apiRoutes);
};
