// var
//   _ = require('lodash'),
//   jwt = require('jsonwebtoken'),
//   User = require('mongoose').model('User');

// function handleError(res, err) {
//   return res.status(500).send(err);
// }

// exports.authenticate = function(req, res, next) {
//   User.findOneByUsername(req.body.username, function(err, user) {
//     if (err) throw err;

//     if (!user) {
//       res.json({
//         success: false,
//         message: 'Authentication failed.  User not found.'
//       });
//     } else if (user) {
//       if (!user.authenticate(req.body.password)) {
//         res.json({
//           success: false,
//           message: 'Authentication failed.  Wrong password.'
//         });
//       } else {
//         var token = jwt.sign(user, req.app.get('secrets').tokenSecret, {
//           expiresInMinutes: 1440 // 24 hours
//         });

//         res.json({
//           success: true,
//           message: 'Enjoy your token!',
//           token: token
//         });
//       }
//     }
//   });
// };
