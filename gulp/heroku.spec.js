// var
//   config = require('../config'),
//   exec = require('child_process').exec,
//   expect = require('chai').expect,
//   heroku = require('./heroku'),
//   Heroku = require('heroku-client'),
//   mock = require('mock-fs'),
//   sinon = require('sinon'),
//   yassert = require('yeoman-assert');

// describe('gulp heroku:apps:list', function() {
//   var stub;

//   after('restore stub', function() {
//     Heroku.prototype.apps.restore();
//   });

//   before('set up stub', function() {
//     stub = sinon.stub(Heroku.prototype, 'apps').returns({
//       list: function(cb) {
//         cb(null, [{name: 'xxx'}]);
//       }
//     });
//   });

//   it('should demo stub usage', function(done) {
//     heroku.herokuAppsList(function(err, apps) {
//       expect(stub.callCount).to.equal(1);
//       expect(apps).to.deep.equal(['xxx']);
//       done();
//     });
//   });
// });

// describe('gulp heroku:deploy', function() {
//   it('should check that built instance exists');
// });

// describe('gulp heroku:setup', function() {
//   it('creates a setup');
// });

// // describe('gulp heroku:tarball', function() {
// //   after('something', function() {
// //     mock.restore();

// //     // files = path.join(config.temp, '**/*.tar.gz');
// //     // del([files], done);
// //   });

// //   before('something', function() {
// //     // Need to create an instance to be tarballed...
// //     mock({
// //       'instances/development': {
// //         'app.json': 'test content'
// //       }
// //     });

// //     // files = path.join(config.temp, '**/*.tar.gz');
// //     // del([files], done);
// //   });

// //   it('creates a tarball', function(done) {
// //     var options = {}

// //     heroku.herokuTarball(options, function(err, result) {
// //       expect(result).to.be.a('string');
// //       yassert.file(result);
// //       done();
// //     });
// //   });
// // });
