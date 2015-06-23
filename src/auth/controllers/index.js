var
  jwt = require('jsonwebtoken'),
  User = require('mongoose').model('User');

exports.authenticate = function(req, res, next) {
  User.findOneByUsername(req.body.username, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({
        success: false,
        message: 'Authentication failed.'
      });
    } else if (user) {
      if (!user.authenticate(req.body.password)) {
        res.status(401).send({
          success: false,
          message: 'Authentication failed.'
        });
      } else {
        var token = jwt.sign(user, req.app.get('secrets').tokenSecret, {
          expiresInMinutes: 1440 // 24 hours
        });

        res.status(200).send({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    } 
  });
};
