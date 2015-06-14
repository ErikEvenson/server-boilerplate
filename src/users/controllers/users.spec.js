var
  expect = require('chai').expect,
  express = require('../../app/config/express.js'),
  mongoose = require('../../app/config/mongoose.js'),
  passport = require('../../app/config/passport'),
  request = require('supertest'),
  should = require('should');

var app, db, user, User;

describe('Users', function() {
  before(function(done) {
    db = mongoose();
    app = express();
    passport = passport();
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

  describe('Users API:', function() {
    describe('GET', function() {
      // it('/api/users', function(done) {
      //   request(app).get('/api/organizations/')
      //     .set('Accept', 'application/json')
      //     .expect('Content-Type', /json/)
      //     .expect(200)
      //     .end(function(err, res) {
      //       res.body.should.be.an.Array.and.have.lengthOf(1);
      //       res.body[0].should.have.property('name', organization.name);
      //       res.body[0].should.have.property('email', organization.email);

      //       done();
      //     });
      // });

      it('/api/users/:username', function(done) {
        request(app).get('/api/users/' + user.username)
          .set('Accept', 'application/json')
          .expect(function(res) {
            console.log('XXX', res.body);
            // res.body.should.be.an.Object
            //   .and.have.property('name', organization.name);

            // res.body.should.have.property('email', organization.email);
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
  });

  describe('Users non-API:', function() {
    describe('Signing in users', function() {
      describe('GET /users/signin', function() {
        it('should show the signin form');
      });

      describe('POST /users/signin', function() {
        it('should signin test user and redirect', function(done) {
          request(app)
            .post('/users/signin')
            .send({
              username: 'username',
              password: 'password'
            })
            .expect('Content-Type', /text\/plain/)
            .expect(function(res) {
              expect(res.headers.location).to.equal('/');
            })
            .expect(302, done);
        });

        it('should not signin bad user and redirect', function(done) {
          request(app)
            .post('/users/signin')
            .send({
              username: 'username',
              password: 'badpassword'
            })
            .expect('Content-Type', /text\/plain/)
            .expect(function(res) {
              expect(res.headers.location).to.equal('/users/signin');
            })
            .expect(302, done);
        });
      });
    });

    describe('Signing out users', function() {
      describe('GET /users/signout', function() {
        it('should signout the user');
      });
    });

    describe('Signing up users', function() {
      describe('GET /users/signup', function() {
        it('should show the signup form');
      });

      describe('POST /users/signup', function() {
        it('should signup user and redirect');
      });
    });
  });

});

