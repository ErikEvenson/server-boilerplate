var
  _ = require('lodash'),
  express = require('express'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose'),
  // usersController = require('../controllers/users');
  uuid = require('uuid');

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
      cb(model.find({}, {
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
    postCreate: function(res, result, done) {
      // Add registration token if user created via API
      mongoose.model('User')
        .findOneByUsername(result.username, function(err, user) {
          user.registrationToken = uuid.v4();

          user.save(function(err) {
            console.log("UUID: ", user.registrationToken);
            done();            
          });
        })
    },
    prereq: function(req) {
      // Allow registrations to POST
      if (
        _.has(req.body, 'isActive')
        && !req.body.isActive 
        && req.method === 'POST'
      ) {
        return true;
      }

      // Prevent POST, PUT, DELETE
      return false;
    },
    // private: '_id,__v,created,email,isActive,name.first,name.last,password,provider,registrationToken,salt',
    protected: '_id,__v,created,email,isActive,name.first,name.last,password,provider,registrationToken,salt',
    strict: true
  });

  app.use(apiRoutes);
};
