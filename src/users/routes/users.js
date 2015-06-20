var
  express = require('express'),
  mongoose = require('mongoose'),
  restify = require('express-restify-mongoose'),
  usersController = require('../controllers/users');

var router = express.Router();

module.exports = function(app) {
  // API routes
  app.route('/authenticate')
    .post(usersController.authenticate);

  restify.serve(router, mongoose.model('User'), {
    idProperty: 'username',
    lowercase: true,
    strict: true
  });

  app.use(router);
};
