var
  mailer = require('express-mailer'),
  mailerOptions = require('./secrets').mailerOptions;

module.exports = function(app) {
  mailer.extend(app, mailerOptions);
};
