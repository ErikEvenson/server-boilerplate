var
  usersController = require('../controllers/users');

module.exports = function(app) {
  // API routes
  app.route('/authenticate')
    .post(usersController.authenticate);

  app.route('/api/users/:username')
    .get(usersController.read);

  app.route('/api/users')
    .get(usersController.list);
};
