var
  expect = require('chai').expect,
  express = require('../../app/config/express.js'),
  mongoose = require('../../app/config/mongoose.js'),
  request = require('supertest'),
  should = require('should');

var
  app,
  db,
  user,
  User;

describe('Users', function() {
  before(function(done) {
    db = mongoose();
    app = express();
    User = db.model('User');

    User.remove(function() {
      user = new User({
        name: {
          first: 'First',
          last: 'Last'
        },
        email: 'test@example.com',
        username: 'username',
        password: 'password',
        provider: 'local'
      });
      user.save(function(err) {
        if (err) return done(err);
        done();
      });
    });
  });

  after(function(done) {
    User.remove().exec();
    db.connection.close(done);
  });

  describe('Authenticate', function() {
    describe('POST /authenticate', function() {
      it('should provide user a token', function(done) {
        request(app)
          .post('/authenticate')
          .send({
            username: 'username',
            password: 'password'
          })
          .set('Accept', 'application/json')
          .expect(function(res) {
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('token');
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

      it('should not provide non-user a token', function(done) {
        request(app)
          .post('/authenticate')
          .send({
            username: 'nonuser',
            password: 'password'
          })
          .set('Accept', 'application/json')
          .expect(function(res) {
            expect(res.body).to.have.property('success', false);
            expect(res.body).to.not.have.property('token');
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

    });
  });
});

