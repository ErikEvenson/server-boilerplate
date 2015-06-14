var
  argv = require('yargs').argv,
  build = require('./build'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  server = require('./server');

gulp.task('default', function() {
  var options = {
    clean: argv.clean || false,
    instance: argv.instance || 'development',
    source: argv.source || 'src'
  };

  if (options.clean) {
    gutil.log(
      'Building ' + options.instance + ' instance from source in ' +
      options.source + ' after cleaning...'
    );
  } else {
    gutil.log(
      'Building ' + options.instance + ' instance from source in ' +
      options.source + '...'
    );
  }

  build.buildInstance(options, function(err) {
    server.serverStart(options.instance);
  });
});
