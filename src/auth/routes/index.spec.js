var
  async = require('async'),
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
  Token,
  User,
  user;

describe('auth', function() {
  before(function(done) {
    db = mongoose();
    app = express();
    environment = app.get('environment');
    Registration = db.model('Registration');
    User = db.model('User');

    apiRoot = environment.apiPrefix + environment.apiVersion;

    var users = [
      {
        email: 'activeUser@example.com',
        isActive: true,
        name: {first: 'Active', last: 'User'},
        password: 'activePassword',
        username: 'activeUser'
      },
      {
        email: 'inactiveUser@example.com',
        isActive: false,
        name: {first: 'Inactive', last: 'User'},
        password: 'inactivePassword',
        username: 'inactiveUser'
      }
    ];

    var registrations = [
      {token: 'token', username: 'inactiveUser'}
    ]

    async.series(
      [
        function(cb) {
          User.remove()
            .then(function(err) {
              User.create(users, cb);
            });
        },
        function(cb) {
          Registration.remove().then(function(err) {
            Registration.create(registrations, cb);
          });
        },
      ],
      function(err, results) {
        done(err);
      }
    );
  });

  after(function(done) {
    async.series(
      [
        function(cb) {
          User.remove().then(cb);
        },
        function(cb) {
          Registration.remove().then(cb);
        },
      ],
      function(err, results) {
        db.connection.close(done);
      }
    );
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

    describe('GET /auth/registrations/:token', function() {
      it('should provide an existing registration', function(done) {
        request(app)
          .get(apiRoot + '/auth/registrations/' + 'token')
          .set('Accept', 'application/json')
          .expect(200, done);
      });
    });

    describe('POST /auth/registrations', function() {
      it('should allow public to POST to get new token via registration', function(done) {
        request(app)
          .post(apiRoot + '/auth/registrations')
          .set('Accept', 'application/json')
          .send({username: 'register'})
          .expect(function(res) {
            expect(res.body).to.deep.equal({username: 'register'});
          })
          .expect(201, done);
      });      
    });
  });


    // https://weblogs.java.net/blog/felipegaucho/archive/2009/10/02/pedantic-guide-restful-registration-use-case


});

