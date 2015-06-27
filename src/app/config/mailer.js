var
  mailer = require('express-mailer');

module.exports = function(app) {
  var mailerOptions = {
    auth: {
      user: app.get('configVars').EMAIL_USERNAME,
      pass: app.get('configVars').EMAIL_PASSWORD
    },
    from: 'noreply@3eenterprises.com',
    host: 'vps2.erikevenson.net',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP'
  };

  mailer.extend(app, mailerOptions);
};
