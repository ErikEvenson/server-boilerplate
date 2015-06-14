process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var
  mongoose = require('./config/mongoose'),
  express = require('./config/express'),
  passport = require('./config/passport');

var db = mongoose();
var app = express(__dirname);
var passport = passport();

app.set('port', (process.env.PORT || 5000));
module.exports = app;
