var
  cache = require('gulp-cached'),
  debug = require('debug')(__filename),
  gjslint = require('gulp-gjslint'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  map = require('map-stream'),
  path = require('path');

var beeper = function(file, cb) {
  return map(function(file, cb) {
    if (!file.jshint.success) {
      // console.log('JSHINT fail in '+file.path);
      file.jshint.results.forEach(function(err) {
        if (err) { gutil.beep(); }
      });
    }
    cb(null, file);
  });
};

var config = require('../config');

var jsLintFiles = [
  path.join(config.basepath, '**/*.js'),

  // Don't lint bower components
  '!**/bower_components/**/*',

  // Don't lint node modules
  '!**/node_modules/**/*',

  // Don't lint instances
  path.join('!' + config.basepath, 'instances/**/*.js')
];

gulp.task('lint', ['lint:gjslint', 'lint:jshint'], function() {
  // Linting...
});

gulp.task('lint:gjslint', function() {
  var options = {
    // This flag doesn't seem to work...
    flags: ['--beep', '--nojsdoc']
  };

  return gulp.src(jsLintFiles)
    .pipe(cache('gjslinting'))
    .pipe(gjslint(options))
    .pipe(gjslint.reporter('console'));
});

gulp.task('lint:jshint', function() {
  return gulp.src(jsLintFiles)
    .pipe(cache('jshinting'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(beeper());
});
