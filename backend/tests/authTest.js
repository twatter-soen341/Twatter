// Import the dependencies for testing
const chai = require('chai');
const expect = require('chai').expect;
const app = require('../server');

exports.authenticationTests = function(test, callback) {
  // Test for user signing up to twatter
  describe('Authentication', () => {
    describe('POST /api/auth/signup', () => {
      let hashedPassword = '';

      it('should create new users', done => {
        chai
          .request(app)
          .post('/api/auth/signup')
          .send(test.newUser)
          .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.message).to.equal('Sign up success!');
            hashedPassword = response.body.auth.password;
            test.newUserId = response.body.auth.user;
          });

        chai
          .request(app)
          .post('/api/auth/signup')
          .send(test.newUser1)
          .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.message).to.equal('Sign up success!');
            test.newUser1Id = response.body.auth.user;
            done();
          });
      });

      // The password stored in the DB should be encrypted
      it('should have hashed the password', done => {
        expect(hashedPassword).to.not.equal('test');
        done();
      });

      // The email should be unique, so an error should be thrown if not unique
      it('should not create multiple users with same email', done => {
        chai
          .request(app)
          .post('/api/auth/signup')
          .send(test.newUser)
          .end((err, response) => {
            expect(response.statusCode).to.equal(500);
            expect(response.body.message).to.equal('Sign up Failed.');
            done();
          });
      });
    });

    // Test for user login to Twatter
    describe('POST /api/auth/login', () => {
      it('should log in with valid credentials (user1)', done => {
        chai
          .request(app)
          .post('/api/auth/login')
          .send(test.userCredentials)
          .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            test.authenticatedUserID = response.body.userId;
            test.authenticatedUserJWT = response.body.token;
            done();
          });
      });

      it('should log in with valid credentials (user2)', done => {
        chai
          .request(app)
          .post('/api/auth/login')
          .send(test.userCredentials1)
          .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            test.authenticatedUserID1 = response.body.userId;
            test.authenticatedUserJWT1 = response.body.token;
            done();
          });
      });

      it('should NOT log in with invalid credentials', done => {
        let invalidCredentials = {
          email: 'test@test.com',
          password: 'wrong password'
        };
        chai
          .request(app)
          .post('/api/auth/login')
          .send(invalidCredentials)
          .end((err, response) => {
            expect(response.statusCode).to.equal(401); // Not Authorized
            callback(test);
            done();
          });
      });
    });
  });
};
