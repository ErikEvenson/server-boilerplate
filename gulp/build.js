var
  argv = require('yargs').argv,
  async = require('async'),
  clean = require('./clean'),
  config = require('../config'),
  del = require('del'),
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  path = require('path');

var lib = {
  buildInstance: function(options, done) {
    var instancePath = path.join(config.instances, options.instance);
    var sourcePath = path.join(config.basepath, options.source, '**/*');

    var sourceFiles = [
      sourcePath,
      path.join(config.basepath, 'package.json')
    ];

    // Remove source directory.
    sourceFiles.push(path.join('!' + config.basepath, options.source));

    // Remove test files.
    sourceFiles.push(path.join(
      '!' + config.basepath, options.source, '**/*.spec.js'
    ));

    async.series([
      // Clean if asked
      function(cb1) {
        if (options.clean) {
          clean.cleanInstance(options.instance, cb1);
        } else {
          cb1();
        }
      },
      // Move files
      function(cb3) {
        gulp.src(sourceFiles)
          .pipe(newer(instancePath))
          .pipe(gulp.dest(instancePath))
          .on('end', cb3);
      },
      // Remove extraneous files
      function(cb6) {
        delFiles = [
        ];

        del(delFiles, cb6);
      }
    ], done);
  }
};

module.exports = lib;

gulp.task('build', function(done) {
  var options = {
    clean: argv.clean || false,
    instance: argv.instance || 'development',
    source: argv.source || 'src'
  };

  return lib.buildInstance(options, done);
});
