var
  expect = require('chai').expect,
  express = require('../../app/config/express.js'),
  mongoose = require('../../app/config/mongoose.js'),
  request = require('supertest'),
  should = require('should');

var
  apiRoot,
  app,
  db,
  environment,
  User,
  user;

describe('users', function() {
  before(function(done) {
    db = mongoose();
    app = express();
    environment = app.get('environment');
    User = db.model('User');

    apiRoot = environment.apiPrefix + environment.apiVersion;

    var testUser = {
      name: {
        first: 'First',
        last: 'Last'
      },
      email: 'test@example.com',
      username: 'username',
      password: 'password'
    };

    User.remove()
      .then(function() {
        user = new User(testUser);

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

  describe('API', function() {
    describe('GET /users', function() {
      it('should not provide public user a list of users', function(done) {
        request(app)
          .get(apiRoot + '/users')
          .set('Accept', 'application/json')
          .expect(403, done);
      });
    });

    describe('GET /users/:username', function() {
      it('should provide a public user a username', function(done) {
        request(app)
          .get(apiRoot + '/users/' + user.username)
          .set('Accept', 'application/json')
          .expect(function(res) {
            expect(res.body).to.deep.equal({username: 'username'});
          })
          .expect(200, done);
      });
    });

    describe('POST /users', function() {
      it('should not allow public to POST new user', function(done) {
        request(app)
          .post(apiRoot + '/users')
          .set('Accept', 'application/json')
          .send({username: 'newusers'})
          .set('Accept', 'application/json')
          .expect(403, done);
      });

      it('should allow public to POST new inactive user', function(done) {
        request(app)
          .post(apiRoot + '/users')
          .set('Accept', 'application/json')
          .send({
            isActive: false,
            email: 'register@example.com',
            password: 'password',
            username: 'register'
          })
          .expect(201)
          .end(function(err, res) {
            expect(res.body).to.deep.equal({});

            User.findOne({username: 'register'}, function(err, user) {
              expect(user.email).to.be.equal('register@example.com');
              expect(user.isActive).to.be.equal(false);
              expect(user.password).to.not.be.a('null');
              done();
            });
          });

      });
    });

    describe('PUT /users', function() {
      it('should allow users to PUT their own info');

      it('should not allow users to PUT others info');
    });

    describe('DELETE /users', function() {
      it('should not allow users to DELETE users');
    });
  });
});
