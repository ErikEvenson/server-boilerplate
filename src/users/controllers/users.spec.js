// var
//   expect = require('chai').expect,
//   express = require('../../app/config/express.js'),
//   mongoose = require('../../app/config/mongoose.js'),
//   passport = require('../../app/config/passport'),
//   request = require('supertest'),
//   should = require('should');

// var
//   app,
//   db,
//   token,
//   user,
//   User;

// describe('Users', function() {
//   before(function(done) {
//     db = mongoose();
//     app = express();
//     passport = passport();
//     User = db.model('User');

//     User.remove(function() {
//       user = new User({
//         name: {
//           first: 'First',
//           last: 'Last'
//         },
//         email: 'test@example.com',
//         username: 'username',
//         password: 'password',
//         provider: 'local'
//       });

//       user.save(function(err) {
//         if (err) return done(err);
//         done();
//       });

//       request(app)
//         .post('/authenticate')
//         .send({
//           username: 'username',
//           password: 'password'
//         })
//         .end(function(err, res) {
//           token = res.body.token;
//         });

//     });
//   });

//   after(function(done) {
//     User.remove().exec();
//     db.connection.close(done);
//   });

//   describe('Users API:', function() {
//     describe('GET /api/users', function() {
//       it('should provide an array of users');
//     });

//     describe('POST /api/users', function() {
//       it('should create a user');
//     });

//     describe('GET /api/users/:username', function() {
//       it('should provide a authed user their record', function(done) {
//         request(app)
//           .get('/api/users/' + user.username)
//           .set('Accept', 'application/json')
//           .set('x-access-token', token)
//           .expect(function(res) {
//             expect(res.body).to.have.property('username', 'username');
//             // expect(res.body).to.not.have.property('password');
//           })
//           .expect('Content-Type', /json/)
//           .expect(200, done);
//       });

//       it('should not provide an unauthed user their record', function(done) {
//         request(app)
//           .get('/api/users/' + user.username)
//           .set('Accept', 'application/json')
//           .expect(function(res) {
//             expect(res.body).to.have.property('success', false);
//             expect(res.body).to.not.have.property('username');
//           })
//           .expect('Content-Type', /json/)
//           .expect(403, done);
//       });

//       it('should not provide user with bad auth their record', function(done) {
//         request(app)
//           .get('/api/users/' + user.username)
//           .set('Accept', 'application/json')
//           .set('x-access-token', 'badtoken')
//           .expect(function(res) {
//             expect(res.body).to.have.property('success', false);
//             expect(res.body).to.not.have.property('username');
//             console.log(res.body);
//           })
//           .expect('Content-Type', /json/)
//           .expect(200, done);
//       });

//     });
//   });
// });

