// var
//   config = require('../config'),
//   del = require('del'),
//   exec = require('child_process').exec,
//   fs = require('fs'),
//   mkdirp = require('mkdirp'),
//   path = require('path');

// // var helpers = require('yeoman-generator').test;
// // var assert = require('yeoman-generator').assert;
// // var injectStyles = require('../.test-instance/tasks/dev');

// var
//   INSTANCE = 'testInstance';

// var instancePathDirectoryTest = function(done) {
//   var instancePath = path.join(config.instances, INSTANCE);

//   fs.stat(instancePath, function(err, stats) {
//     if (err) {
//       done(err, stats);
//     } else {
//       if (stats.isDirectory()) {
//         done(err, stats);
//       } else {
//         done(new Error('test instance is not a directory.', stats));
//       }
//     }
//   });
// };

// var clean = function(done) {
//   exec(
//     'gulp clean --instance ' + INSTANCE,
//     {
//       cwd: config.basepath
//     },
//     function(err, stdout, stderr) {
//       done();
//     }
//   );
// };

// describe('gulp clean', function() {
//   var instancePath = path.join(config.instances, INSTANCE);

//   afterEach(function(done) {
//     this.timeout(1000);
//     del.sync([instancePath]);
//     done();
//   });

//   beforeEach(function(done) {
//     this.timeout(1000);
//     del.sync([instancePath]);
//     done();
//   });

//   context('with existing instance directory', function() {
//     var dummyFilePath = path.join(instancePath, 'dummy.txt');

//     beforeEach(function(done) {
//       this.timeout(1000);
//       mkdirp.sync(instancePath);
//       fs.writeFileSync(dummyFilePath, 'dummy content');
//       clean(done);
//     });

//     it('clears the instance directory', function(done) {
//       fs.stat(dummyFilePath, function(err, stats) {
//         if (err) done();
//         else done(new Error('build is not clearing instance directory.'));
//       });
//     });
//   });

//   context('without existing instance directory', function() {
//     beforeEach(function(done) {
//       this.timeout(1000);
//       clean(done);
//     });

//     it('creates the instance directory', function(done) {
//       instancePathDirectoryTest(done);
//     });
//   });
// });

// // describe('gulp build', function ()
// // {
// //     var instancePath = path.join(__dirname, '../.test-instance');
// //     var mainScss = path.join(instancePath, 'app/styles/main.scss');
// //     var gulpfile = path.join(instancePath, 'gulpfile.js');
// //     var gulp = '$(which gulp)';
// //     var injectStylesCmd = gulp + ' injectStyles';

// //     describe('scss partials in styles folder', function ()
// //     {
// //         var expectedContent = [
// //             [mainScss, /_variables/],
// //             [mainScss, /base\/_buttons\.scss/],
// //             [mainScss, /base\/_fonts\.scss/],
// //             [mainScss, /base\/_forms\.scss/],
// //             [mainScss, /base\/_icons\.scss/],
// //             [mainScss, /base\/_lists\.scss/],
// //             [mainScss, /base\/_page\.scss/],
// //             [mainScss, /base\/_tables\.scss/],
// //             [mainScss, /base\/_typography\.scss/],
// //             [mainScss, /functions\/_some-function\.scss/],
// //             [mainScss, /mixins\/_some-mixin\.scss/],
// //             [mainScss, /placeholders\/_some-placeholder\.scss/]
// //         ];
// //         var expected = [
// //             mainScss
// //         ];


// //         beforeEach(function (done)
// //         {
// //             this.timeout(10000);
// //             fs.truncateSync(mainScss);
// //             fs.writeFileSync(mainScss, '// inject:sass\n\n// endinject');
// //             exec(injectStylesCmd + ' injectStyles', {
// //                 cwd: instancePath
// //             }, function (err, stdout)
// //             {
// //                 done();
// //             });
// //         });

// //         it('creates expected files', function ()
// //         {
// //             assert.file([].concat(
// //                 expected
// //             ));
// //             assert.fileContent([].concat(
// //                 expectedContent
// //             ));
// //         });
// //     });
// // });
