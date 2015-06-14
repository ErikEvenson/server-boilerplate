var
  app,
  db,
  express = require('../../app/config/express.js'),
  mongoose = require('../../app/config/mongoose.js'),
  should = require('should');

var user, User, organization, Organization;

describe('Organization Model Unit Tests:', function() {
  before(function() {
    db = mongoose();
    app = express();
    User = db.model('User');
    Organization = db.model('Organization');
  });

  beforeEach(function(done) {
    user = new User({
      name: {
        first: 'First',
        last: 'Last'
      },
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      organization = new Organization({
        name: 'Organization Name',
        email: 'org@example.com',
        creator: user
      });

      done();
    });
  });

  describe('Testing the save method', function() {
    it('Should be able to save without problems', function() {
      organization.save(function(err) {
        should.not.exist(err);
      });
    });

    it('Should not be able to save an organization without a name', function() {
      organization.name = '';

      organization.save(function(err) {
        should.exist(err);
      });
    });
  });

  afterEach(function(done) {
    Organization.remove(function() {
      User.remove(function() {
        done();
      });
    });
  });

  after(function(done) {
    db.connection.close(done);
  });
});
