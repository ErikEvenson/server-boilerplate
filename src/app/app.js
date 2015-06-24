process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var
  mongoose = require('./config/mongoose'),
  express = require('./config/express');

var db = mongoose();
var app = express(__dirname);

app.set('port', (process.env.PORT || 5000));
module.exports = app;
