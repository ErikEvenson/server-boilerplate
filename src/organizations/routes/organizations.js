var
  usersController = require('../../users/controllers/users'),
  organizationsController = require('../controllers/organizations');

module.exports = function(app) {
  app.route('/api/organizations')
    .get(
      usersController.requiresLogin,
      organizationsController.list
    )
    .post(
      usersController.requiresLogin,
      organizationsController.create
    );

  app.route('/api/organizations/:organizationId')
    .get(
      usersController.requiresLogin,
      organizationsController.read
    )
    .put(
      usersController.requiresLogin,
      organizationsController.hasAuthorization,
      organizationsController.update
    ).delete(
      usersController.requiresLogin,
      organizationsController.hasAuthorization,
      organizationsController.delete
    );

  app.param('organizationId', organizationsController.organizationByID);
};
