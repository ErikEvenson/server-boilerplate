var
  passport = require('passport'),
  usersController = require('../controllers/users');

module.exports = function(app) {
  app.route('/users/signup')
    .get(usersController.renderSignup)
    .post(usersController.signup);

  app.route('/users/signin')
    .get(usersController.renderSignin)
    .post(passport.authenticate(
      'local',
      {
        successRedirect: '/',
        failureRedirect: '/users/signin',
        failureFlash: true
      }
    ));

  app.get('/users/signout', usersController.signout);

  app.route('/api/users/:username')
    .get(
      // usersController.requiresLogin,
      usersController.read
    );

  app.param('username', usersController.userByUsername);
};
