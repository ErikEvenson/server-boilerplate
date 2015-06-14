var
  aws = require('./aws'),
  config = require('../config'),
  expect = require('chai').expect;

describe('gulp aws:awsGetPutUrl', function() {
  it('provides a PUT URL', function(done) {
    this.timeout(5000);
    var filename = 'test.txt';

    aws.awsGetPutUrl(filename, function(err, putUrl) {
      if (err) throw err;
      expect(putUrl).to.be.a('string');
      done();
    });
  });
});
