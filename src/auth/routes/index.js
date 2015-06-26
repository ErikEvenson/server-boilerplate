var
  authController = require('../controllers'),
  express = require('express'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose'),
  uuid = require('uuid');

var authRoutes = express.Router();
var apiRoutes = express.Router();
var User = mongoose.model('User');

module.exports = function(app) {
  // authRoutes.use(function(req, res, next) {
  //   var token = (
  //     req.body.token || req.query.token || req.headers['x-access-token']
  //   );

  //   if (token) {
  //     jwt.verify(
  //       token,
  //       req.app.get('configVars').TOKEN_SECRET,
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

  // Authenticate  
  app.route('/authenticate')
    .post(authController.authenticate);

  app.route('/api/v1/auth/registrations/:token/activate')
    .post(authController.activate);

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
    postCreate: function(res, result, done) {
      if (result.username) {
        User.findOne({username: result.username}, function(err, user) {
          if (err) done(err);

          if (user && user.email) {
            app.mailer.send(
              'auth.registration.jade',
              {
                to: user.email,
                subject: 'Registration on ...',
                otherProperty: 'other property'
              },
              function(err) {
                if (err) {
                  console.log(err);
                  return done(err);
                }
                
                return done();
              }
            );            
          } else {
            return done();
          }
        });
      }
    },
    prereq: function(req) {
      return true;
    },
    private: '_id,created,token,__v',
    protected: '_id,created,token,__v',
    strict: true
  });

  app.use(apiRoutes);
};
