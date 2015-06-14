var
  argv = require('yargs').argv,
  debug = require('debug')(__filename),
  gulp = require('gulp'),
  path = require('path'),
  server = require('gulp-develop-server');

var config = require('../config');

var lib = {
  serverStart: function(instance) {
    var app = path.join(config.basepath, 'instances', instance, 'bin/www');
    server.listen({path: app});
  }
};

module.exports = lib;

gulp.task('server:start', function() {
  var instance = argv.instance || 'development';
  lib.serverStart(instance);
});
