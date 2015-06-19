var
  _ = require('lodash'),
  jwt = require('jsonwebtoken'),
  User = require('mongoose').model('User');

function handleError(res, err) {
  return res.send(500, err);
}

exports.authenticate = function(req, res, next) {
  User.findOneByUsername(req.body.username, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed.  User not found.'
      });
    } else if (user) {
      if (!user.authenticate(req.body.password)) {
        res.json({
          success: false,
          message: 'Authentication failed.  Wrong password.'
        });
      } else {
        var token = jwt.sign(user, req.app.get('secrets').tokenSecret, {
          expiresInMinutes: 1440 // 24 hours
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
};

exports.create = function(req, res) {
  User.create(req.body, function(err, user) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(user);
  });
};

exports.index = function(req, res) {
  User.find()
    .sort('-username')
    .select('-password -salt')
    .exec(function(err, users) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(users);
    });
};

exports.show = function(req, res) {
  User.findOne({username: new RegExp(req.params.username, 'i')})
    .select('-password -salt')
    .exec(function(err, user) {
      if (err) { return handleError(res, err); }
      if (!user) { return res.send(404); }
      return res.json(user);
    });
};

exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  User.findOne({username: new RegExp(req.params.username, 'i')})
    .select('-password -salt')
    .exec(function(err, user) {
      if (err) { return handleError(res, err); }
      if(!user) { return res.send(404); }
      var updated = _.merge(user, req.body);

      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, user);
      });      
    });
};
