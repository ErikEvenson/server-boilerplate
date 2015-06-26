var
  mailer = require('express-mailer'),
  secrets = require('./secrets');

module.exports = function(app) {
  var mailerOptions = {
    auth: {
      user: secrets.emailUsername,
      pass: secrets.emailPassword
    },
    from: 'noreply@3eenterprises.com',
    host: 'vps2.erikevenson.net',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP'
  };

  mailer.extend(app, mailerOptions);
};
