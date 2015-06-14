// at the top of the test spec:
var fs = require('fs');
var should = require('chai').should();

// abstract writing screen shot to a file
function writeScreenShot(data, filename) {
  var stream = fs.createWriteStream(filename);

  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

describe('first', function() {
  beforeEach(function() {
      isAngularSite(false);
  });

  it('runs dummy test', function() {
    browser.get('/');

    var el = element(by.id('e2e'));
    expect(browser.getTitle()).toEqual('Hello World');

    browser.takeScreenshot().then(function(png) {
      writeScreenShot(png, __dirname + '/output/first.png');
    });
  });
});
