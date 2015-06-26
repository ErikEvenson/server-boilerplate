var
  _ = require('lodash'),
  argv = require('yargs').argv,
  async = require('async'),
  aws = require('./aws'),
  config = require('../config'),
  del = require('del'),
  fs = require('fs'),
  gcallback = require('gulp-callback'),
  gzip = require('gulp-gzip'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  Heroku = require('heroku-client'),
  keys = require('../secrets/keys'),
  path = require('path'),
  request = require('request'),
  tar = require('gulp-tar'),
  url = require('url'),
  uuid = require('uuid'),
  yassert = require('yeoman-assert');

var keys = require(path.join(config.secrets, 'keys'));
var heroku = new Heroku({token: keys.HEROKU_API_TOKEN});

var herokuAppsConfigVarsInfo = function(options, cb) {
  if (!options.app) return cb(new Error('no app provided.'));

  heroku.apps(options.app).configVars().info(function(err, configVars) {
    if (err) return cb(err);
    return cb(null, configVars);
  });
};

var herokuAppsConfigVarsUpdate = function(options, cb) {
  if (!options.app) return cb(new Error('no app provided.'));
  if (!options.attributes) return cb(new Error('no attributes provided.'));

  heroku.apps(options.app).configVars()
    .update(options.attributes, function(err, configVars) {
      if (err) return cb(err);
      return cb(null, configVars);
    });
};

var herokuAppsList = function(cb) {
  heroku.apps().list(function(err, apps) {
    if (err) return cb(err);
    return cb(null, apps);
  });
};

var herokuAppsInfo = function(options, cb) {
  if (!options.app) return cb(new Error('no app provided.'));

  heroku.apps(options.app).info(function(err, info) {
    if (err) return cb(err);
    return cb(null, info);
  });
};

var herokuDeploySource = function(options, done) {
  if (!options.instance) return cb(new Error('no instance provided.'));
  if (!options.app) return cb(new Error('no app provided.'));
  var appObj = heroku.apps(options.app);
  var tarballPath;

  async.waterfall([
    // Create a heroku tarball
    function(cb) {
      herokuTarball(options, cb);
    },
    // Create a heroku source
    function(result, cb) {
      tarballPath = result;

      appObj.sources().create(
        {},
        function(err, source) {
          if (err) return cb(err);
          return cb(null, source);
        }
      );
    },
    // PUT tarball to source
    function(source, cb) {
      var putUrl = source.source_blob.put_url;

      herokuPutFile(tarballPath, putUrl, function(err) {
        if (err) { return cb(err); } else { return cb(null, source); }
      });
    },
    // Create a heroku build
    function(source, cb) {
      var getUrl = source.source_blob.get_url;

      appObj.builds().create(
        {
          source_blob: {
            url: getUrl
          }
        },
        function(err, result) {
          if (err) { return cb(err); } else { return cb(null, result); }
        }
      );
    }
  ], done);
};

var herokuPutFile = function(file, putUrl, cb) {
  var urlObj = url.parse(putUrl);

  fs.readFile(file, function(err, data) {
    if (err) { return cb(err); }
    else {
      var options = {
        body: data,
        method: 'PUT',
        url: urlObj
      };

      request(options, function(err, incoming, response) {
        if (err) { return cb(err); } else { return cb(null); }
      });
    }
  });
};

var herokuSetup = function(options, done) {
  if (!options.instance) return cb(new Error('no instance provided.'));
  var app = options.app || null;
  var tarballPath;

  async.waterfall([
    // Create a heroku tarball
    function(cb) {
      herokuTarball(options, cb);
    },
    // Create AWS PUT URL
    function(result, cb) {
      tarballPath = result;
      var filename = path.basename(tarballPath);

      aws.awsGetPutUrl(filename, function(err, putUrl) {
        return cb(err, putUrl);
      });
    },
    // Put heroku tarball to AWS PUT URL
    function(putUrl, cb) {
      herokuPutFile(tarballPath, putUrl, function(err) {
        if (err) {
         return cb(err);
        } else {
          return cb(null, putUrl.split('?')[0]);
        }
      });
    },
    // Send app setup to heroku
    function(getUrl, cb) {
      var attributes = {
        app: {
          name: app
        },
        source_blob: {
          url: getUrl
        }
      };

      heroku.appSetups().create(attributes, cb);
    }
  ], function(err, result) {
    done(err, result);
  });
};

var herokuTarball = function(options, done) {
  var instance = options.instance || 'development';
  var tarballName = options.tarballName || instance;
  var tarballPath = path.join(config.temp, tarballName + '.tar.gz');
  var files = path.join(config.instances, instance, '**/*');
  yassert.file(path.join(config.instances, instance, 'app.json'));

  async.waterfall([
    function(cb) {
      del([tarballPath], cb);
    },
    function(err, cb) {
      gulp.src(files)
        .pipe(tar(tarballName + '.tar'))
        .pipe(gzip())
        .pipe(gulp.dest(config.temp))
        .pipe(gcallback(cb));
    }
  ], function(err, result) {
    if (err) return err;
    return done(err, tarballPath);
  });
};

var lib = {
  herokuAppsConfigVarsInfo: herokuAppsConfigVarsInfo,
  herokuAppsInfo: herokuAppsInfo,
  herokuAppsList: herokuAppsList,
  herokuPutFile: herokuPutFile,
  herokuSetup: herokuSetup,
  herokuTarball: herokuTarball
};

module.exports = lib;

gulp.task('heroku:apps:configVars:update', function(done) {
  var app = argv.app || null;
  if (!app) return done(new Error('An app is required.'));
  var configVars = require('../src/app/config/secrets').configVars[app];

  var options = {
    app: app,
    attributes: configVars
  };

  herokuAppsConfigVarsUpdate(options, function(err, configVars) {
    if (err) return gutil.log(err);
    gutil.log(configVars);
  });
});

gulp.task('heroku:apps:configVars:info', function(done) {
  var options = {
    app: argv.app || null
  };

  herokuAppsConfigVarsInfo(options, function(err, configVars) {
    if (err) return gutil.log(err);
    gutil.log(configVars);
  });
});

gulp.task('heroku:apps:info', function(done) {
  var options = {
    app: argv.app || null
  };

  herokuAppsInfo(options, function(err, info) {
    if (err) return done(err);
    gutil.log(info);
    return done();
  });
});

gulp.task('heroku:apps:list', function(done) {
  herokuAppsList(function(err, apps) {
    if (err) return done(err);
    gutil.log(apps);
    return done()
  });
});

gulp.task('heroku:deploy', function(done) {
  var options = {
    app: argv.app || null,
    instance: argv.instance || 'development'
  };

  async.waterfall([
    // Check if app exists
    function(cb) {
      if (!options.app) return cb(null, false);

      herokuAppsList(function(err, apps) {
        var appsList = [];

        apps.forEach(function(app) {
          appsList.push(app.name);
        });

        if (err) return cb(err);
        return cb(null, _.contains(appsList, options.app));
      });
    },
    // Deploy if app exists, setup if new
    function(appExists, cb) {
      if (appExists) {
        // deploy source
        herokuDeploySource(options, function(err, response) {
          cb(err, response);
        });
      } else {
        // Setup app
        herokuSetup(options, function(err, response) {
          options.app = response.app.name;
          cb(err, response);
        });
      }
    },
    // Update config vars in case something has changed
    function(response, cb) {
      options.attributes = require('../src/app/config/secrets')
        .configVars[options.app];

      herokuAppsConfigVarsUpdate(options, function(err, configVars) {
        cb(err, configVars);
      });
    }
  ], function(err, result) {
    gutil.log(options.app + ' deployed.');
    done();
  });
});

// heroku:setup is used to deploy a heroku app for the first time
gulp.task('heroku:setup', function(done) {
  var options = {
    app: argv.app || null,
    instance: argv.instance || 'development'
  };

  herokuSetup(options, function(err, response) {
    if (err) throw err;
    gutil.log(response);
    done();
  });
});

gulp.task('heroku:tarball', function(done) {
  var options = {};
  herokuTarball(options, done);
});
