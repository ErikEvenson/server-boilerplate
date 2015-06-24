var
  jwt = require('jsonwebtoken'),
  Registration = require('mongoose').model('Registration');
  User = require('mongoose').model('User');

exports.activate = function(req, res, next) {
  var token = req.params.token;

  Registration.findOne({token: token}, function(err, registration) {
    if (err) return next(err);

    User.findOneByUsername(registration.username, function(err, user) {
      if (err) return next(err);
      user.isActive = true;

      user.save(function(err) {
        if (err) return next(err);

        registration.remove(function(err) {
          if (err) return next(err);
          return res.status(200).send({token: token});
        });
      });
    });
  });
};

exports.authenticate = function(req, res, next) {
  User.findOneByUsername(req.body.username, function(err, user) {
    if (err) return next(err);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'Authentication failed.'
      });
    } else if (user) {
      if (!user.authenticate(req.body.password)) {
        return res.status(401).send({
          success: false,
          message: 'Authentication failed.'
        });
      } else {
        var token = jwt.sign(user, req.app.get('secrets').tokenSecret, {
          expiresInMinutes: 1440 // 24 hours
        });

        return res.status(200).send({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    } 
  });
};
