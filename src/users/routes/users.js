var
  usersController = require('../controllers/users');

module.exports = function(app) {
  // API routes
  app.route('/authenticate')
    .post(usersController.authenticate);

  app.route('/api/users/:username')
    .delete(usersController.destroy)
    .get(usersController.show)
    .patch(usersController.update)
    .put(usersController.update);

  app.route('/api/users')
    .get(usersController.index)
    .post(usersController.create);
};
