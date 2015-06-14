/**
 * Provides protractor config.
*/

var config = require('../../config');
var basepath = config.basepath;
var build = require('../../gulp/build');
var path = require('path');
var q = require('q');
var deferred = q.defer();

var prepareInstance = function() {
  return q.Promise(function(resolve, reject, notify) {
    process.env.PORT = 3001;

    options = {
      clean: true,
      instance: 'test',
      source: 'src'
    };

    build.buildInstance(options, function(err) {
      require(path.join(config.instances, options.instance, 'bin/www'));
      resolve();
    });
  });
};

exports.config = {
  baseUrl: 'http://localhost:3001',
  beforeLaunch: function() {
    prepareInstance().then(function() {
      deferred.resolve();
    });

    return deferred.promise;
  },
  directConnect: true,
  // framework: 'jasmine2',
  multiCapabilities: [
    {
      browserName: 'chrome'
    }
    // {
    //   browserName: 'phantomjs',
    //   'phantom.binary.path': '/usr/local/node/node-default/bin/phantomjs'
    // }
  ],
  onPrepare: function() {
    // Inspired by
    // http://ng-learn.org/2014/02/Protractor_Testing_With_Angular_And_Non_Angular_Sites/
    global.isAngularSite = function(flag) {
        browser.ignoreSynchronization = !flag;
    };

    process.env.PORT = 3001;
  },
  specs: [
    '*.spec.js'
  ]
};
