var
  argv = require('yargs').argv,
  config = require('../config'),
  del = require('del'),
  gulp = require('gulp'),
  mkdirp = require('mkdirp'),
  path = require('path');

var lib = {
  cleanInstance: function(instance, cb) {
    if (!instance) return cb(new Error('no instance provided.'));
    var instancePath = path.join(config.instances, instance);

    del([instancePath], function(err, deletedPaths) {
      if (err) return cb(err);

      mkdirp(instancePath, function(err, made) {
        return cb(err);
      });
    });
  }
};

module.exports = lib;

gulp.task('clean', function(cb) {
  var instance = argv.instance || 'development';
  lib.cleanInstance(instance, cb);
});
