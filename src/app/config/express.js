var
  compression = require('compression'),
  bodyParser = require('body-parser'),
  environment = require('./environment'),
  express = require('express'),
  flash = require('connect-flash'),
  jwt = require('jsonwebtoken'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  path = require('path'),
  secrets = require('./secrets');

/**
  * @return {Function} - The express application.
 */

module.exports = function() {
  var app = express();
  var instancePath = environment.instancePath;
  var forceSSL = require('./ssl').force(environment.hostname);

  app.set('environment', environment);
  app.set('secrets', secrets);

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compression({
      threshold: 1024
    }));
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());

  // Set up SSL
  if (
    environment.hostname === 'production' || environment.hostname === 'staging'
  ) {
    app.use(forceSSL);
  }

  // Set up view engines
  viewPaths = [
    path.join(instancePath, 'app/views')
  ];

  app.set('views', viewPaths);
  app.set('view engine', 'jade');

  // Set up connect-flash
  app.use(flash());

  // Set up routes
  // require(path.join(instancePath, 'app/routes/app'))(app);
  require(path.join(instancePath, 'auth/routes'))(app);
  require(path.join(instancePath, 'users/routes'))(app);

  // Serve static assets
  app.use('/', express.static(path.join(instancePath, 'public')));

  // // Redirect anything else to static
  // app.get('*', function(req, res) {
  //   res.redirect('/public');
  // });

  return app;
};
