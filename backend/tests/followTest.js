// Import the dependencies for testing
const chai = require('chai');
const assert = require('chai').assert;
const app = require('../server');

exports.followTests = function(test, callback) {
  describe('Core Feature: Following A User', () => {
    describe('As a user, I want to follow/unfollow another user so that I can see their latest posts. #63', () => {
      it('should follow given user', done => {
        chai
          .request(app)
          .put(`/api/user/follow-user/`)
          .send({ wantToFollow: test.newUser1Id, user_id: test.newUserId })
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            assert.equal(res.body.user.following.length, 1);
            assert.equal(res.body.user.following[0], test.newUser1Id);
            done();
          });
      });

      it('should not follow user that does not exist', done => {
        chai
          .request(app)
          .put(`/api/user/follow-user/`)
          .send({ wantToFollow: 'invalid', user_id: test.newUserId })
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    describe('As a user, I want to see all the users I follow and users following me. #84', () => {
      it('should return the user following me', done => {
        chai
          .request(app)
          .get(`/api/user/followers/${test.newUserId}`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            assert.equal(res.body.followers.length, 0);
            res.should.have.status(200);
            done();
          });
      });

      it('should return the user I am following', done => {
        chai
          .request(app)
          .get(`/api/user/following/${test.newUserId}`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            assert.equal(res.body.following.length, 1);
            assert.equal(res.body.following[0]._id, test.newUser1Id);
            res.should.have.status(200);
            done();
          });
      });

      it('should return an error if user given is invalid', done => {
        chai
          .request(app)
          .get(`/api/user/following/invalid`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(500);
          });

        chai
          .request(app)
          .get(`/api/user/followers/invalid`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(500);
            callback(test);
            done();
          });
      });
    });
  });
};
