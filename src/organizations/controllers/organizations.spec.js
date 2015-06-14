// var
//   app,
//   db,
//   express = require('../../app/config/express.js'),
//   mongoose = require('../../app/config/mongoose.js'),
//   request = require('supertest'),
//   should = require('should');

// var user, User, organization, Organization;

// describe('Organizations Controller Unit Tests:', function() {
//   before(function() {
//     db = mongoose();
//     app = express();
//     User = db.model('User');
//     Organization = db.model('Organization');
//   });

//   beforeEach(function(done) {
//     user = new User({
//       name: {
//         first: 'First',
//         last: 'Last'
//       },
//       email: 'test@test.com',
//       username: 'username',
//       password: 'password'
//     });

//     user.save(function() {
//       organization = new Organization({
//         name: 'Organization name',
//         email: 'org@example.com',
//         creator: user
//       });

//       organization.save(function(err) {
//         done();
//       });
//     });
//   });

//   describe('Testing the GET methods', function() {
//     it('Should be able to get the list of organizations', function(done) {
//       request(app).get('/api/organizations/')
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(function(err, res) {
//           res.body.should.be.an.Array.and.have.lengthOf(1);
//           res.body[0].should.have.property('name', organization.name);
//           res.body[0].should.have.property('email', organization.email);

//           done();
//         });
//     });

//     it('Should be able to get the specific organization', function(done) {
//       request(app).get('/api/organizations/' + organization.id)
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(function(err, res) {
//           res.body.should.be.an.Object
//             .and.have.property('name', organization.name);

//           res.body.should.have.property('email', organization.email);

//           done();
//         });
//     });
//   });

//   afterEach(function(done) {
//     Organization.remove().exec();
//     User.remove().exec();
//     done();
//   });

//   after(function(done) {
//     db.connection.close(done);
//   });
// });
