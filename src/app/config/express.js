var
  compression = require('compression'),
  bodyParser = require('body-parser'),
  environment = require('./environment'),
  express = require('express'),
  flash = require('connect-flash'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  passport = require('passport'),
  path = require('path'),
  session = require('express-session');

/**
  * @return {Function} - The express application.
 */

module.exports = function() {
  var app = express();
  var instancePath = path.join(__dirname, '../..');
  var forceSSL = require('./ssl').force(environment.hostname);

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

  // Set up express-session
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: environment.sessionSecret
  }));

  // Set up view engines
  viewPaths = [
    path.join(instancePath, 'app/views'),
    path.join(instancePath, 'users/views'),
    path.join(instancePath, 'organizations/views')
  ];

  app.set('views', viewPaths);
  app.set('view engine', 'jade');

  // Set up connect-flash
  app.use(flash());

  // Set up passport authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up routes
  require(path.join(instancePath, 'app/routes/app'))(app);
  require(path.join(instancePath, 'users/routes/users'))(app);
  require(path.join(instancePath, 'organizations/routes/organizations'))(app);

  // Serve static assets
  app.use('/app/public', express.static(path.join(instancePath, 'app/public')));

  return app;
};
