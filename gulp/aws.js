var
  aws = require('aws-sdk'),
  config = require('../config'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  keys = require('../secrets/keys'),
  path = require('path'),
  uuid = require('uuid');

var keys = require(path.join(config.secrets, 'keys'));
  aws.config.update({
    accessKeyId: keys.AWS_ACCESS_KEY_ID,
    region: config.aws.region,
    secretAccessKey: keys.AWS_SECRET_ACCESS_KEY
  });

var s3 = new aws.S3({computeChecksums: true});

var awsCreateBucket = function(bucketName, cb) {
  s3.createBucket({
    Bucket: bucketName
  }, cb);
};

var awsGetPutUrl = function(filename, done) {
  var key = path.join(uuid.v4(), filename);
  var params = {Bucket: config.aws.bucket, Key: key};

  s3.getSignedUrl('putObject', params, function(err, putUrl) {
    done(err, putUrl);
  });
};

var lib = {
  awsCreateBucket: awsCreateBucket,
  awsGetPutUrl: awsGetPutUrl
};

module.exports = lib;

gulp.task('aws:s3:createBucket', function(done) {
  lib.awsCreateBucket(argv.name, function(err, result) {
    if (err) {
      gutil.log(err);
      return done(err);
    } else {
      gutil.log(result);
      return done();
    }
  });
});
