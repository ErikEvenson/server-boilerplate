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

describe('auth', function() {
  before(function(done) {
    db = mongoose();
    app = express();
    environment = app.get('environment');
    User = db.model('User');

    apiRoot = environment.apiPrefix + environment.apiVersion;

    var users = [
      {
        email: 'activeUser@example.com',
        isActive: true,
        name: {first: 'Active', last: 'User'},
        password: 'activePassword',
        registrationToken: null,
        username: 'activeUser'
      },
      {
        email: 'inactiveUser@example.com',
        isActive: false,
        name: {first: 'Inactive', last: 'User'},
        password: 'inactivePassword',
        registrationToken: 'token',
        username: 'inactiveUser'
      }
    ];

    User.remove()
      .then(function() {
        User.create(users, function(err) {
          if (err) return done(err);
          done();
        });
      });
  });

  after(function(done) {
    User.remove().exec();
    db.connection.close(done);
  });

  describe('authenticate', function() {
    it('should not authorize bad users', function(done) {
      request(app)
        .post('/authenticate')
        .set('Accept', 'application/json')
        .send({username: 'badUser', password: 'badPassword'})
        .expect(401, done);
    });

    it('should not authorize inactive users', function(done) {
      request(app)
        .post('/authenticate')
        .set('Accept', 'application/json')
        .send({username: 'inactiveUser', password: 'inactivePassword'})
        .expect(401)
        .end(function(err, res) {
          expect(res.body).to.not.have.property('token');
          done();
        });
    });    

    it('should authorize active users and provide token', function(done) {
      request(app)
        .post('/authenticate')
        .set('Accept', 'application/json')
        .send({username: 'activeUser', password: 'activePassword'})
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('token');
          done();
        });
    });    
  });

  describe('auth API:', function() {
    describe('GET /auth/registrations', function() {
      it('should not provide public user a list of registrations', function(done) {
        request(app)
          .get(apiRoot + '/users')
          .set('Accept', 'application/json')
          .expect(403, done);
      });
    });

    describe('GET /auth/registrations/:registrationToken', function() {
      it('should provide an existing registration and enable user', function(done) {
        request(app)
          .get(apiRoot + '/auth/registrations/' + 'token')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.deep.equal({registrationToken: 'token'});

            User.findOne({username: 'inactiveUser'}, function(err, registeredUser) {
              expect(registeredUser.isActive).to.equal(true);
              done();              
            });
          });

      });
    });
  });

    // describe('POST /users', function() {
    //   it('should not allow public to POST new user', function(done) {
    //     request(app)
    //       .post(apiRoot + '/users')
    //       .set('Accept', 'application/json')
    //       .send({username: 'newusers'})
    //       .set('Accept', 'application/json')
    //       .expect(403, done);
    //   });

    //   it('should allow public to POST new user via registration', function(done) {
    //     request(app)
    //       .post(apiRoot + '/users')
    //       .set('Accept', 'application/json')
    //       .send({
    //         isActive: false,
    //         email: 'register@example.com',
    //         username: 'register'
    //       })
    //       .expect(function(res) {
    //         expect(res.body).to.deep.equal({username: 'register'});
    //       })
    //       .expect(201, done);
    //   });
    // });

    // describe('PUT /users', function() {
    //   it('should allow users to PUT their own info');

    //   it('should not allow users to PUT others info');
    // });

    // describe('DELETE /users', function() {
    //   it('should not allow users to DELETE users');
    // });
});
