// var
//   build = require('./build'),
//   clean = require('./clean'),
//   config = require('../config'),
//   del = require('del'),
//   exec = require('child_process').exec,
//   fs = require('fs'),
//   mkdirp = require('mkdirp'),
//   path = require('path'),
//   yassert = require('yeoman-assert');

// var
//   SOURCE = 'gulp/test/fixtures/build/src',
//   INSTANCE = 'test';

// describe('gulp build', function() {
//   afterEach(function(done) {
//     this.timeout(1000);
//     clean.cleanInstance(INSTANCE, done);
//   });

//   beforeEach(function(done) {
//     this.timeout(1000);
//     clean.cleanInstance(INSTANCE, done);
//   });

//   it('should move source files to instance directory', function() {
//     build.buildInstance(INSTANCE, SOURCE).on('end', function() {
//       yassert.file([
//         path.join(config.instances, INSTANCE, 'dummy.txt'),
//         path.join(config.instances, INSTANCE, 'package.json')
//       ]);
//     });
//   });
// });
