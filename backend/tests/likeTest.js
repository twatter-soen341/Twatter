// Import the dependencies for testing
const chai = require('chai');
const assert = require('chai').assert;
const app = require('../server');

exports.likeTests = function(test, callback){
  describe('Core Feature: Liking a Twat', () => {
    describe('As a user, I want to like a Tweet so that I can show my appreciation to the poster. #38', () => {
      it('should like a twat', done => {
        let updatedTwat = {
          content: test.twat2.content,
          likedBy: [test.newUserId],
          comments: test.twat2.comments
        };
        chai
          .request(app)
          .put(`/api/twat/${test.twat2ID}`)
          .send({
            content: updatedTwat.content,
            likedBy: updatedTwat.likedBy,
            comments: updatedTwat.comments
          })
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('As a user, I want to know which user liked my tweet #83', () => {
      it('should show the users that liked a twat', done => {
        chai
          .request(app)
          .get(`/api/twat/${test.twat2ID}`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            // Verifying that the twat has been correctly updated
            assert.equal(res.body.twat._id, test.twat2ID);
            // console.log(res.body.twat.likedBy);
            assert.equal(
              JSON.stringify(res.body.twat.likedBy),
              JSON.stringify([test.newUserId])
            );
            done();
          });
      });
    });

    describe('As a user I would like to unlike a post so that I can remove my appreciation from the post #179', () => {
      it('should unlike a twat', done => {
        let newList = [test.newUserId].filter(function(value) {
          return value != test.newUserId;
        });
        let updatedTwat = {
          content: test.twat2.content,
          likedBy: newList,
          comments: test.twat2.comments
        };
        chai
          .request(app)
          .put(`/api/twat/${test.twat2ID}`)
          .send({
            content: updatedTwat.content,
            likedBy: updatedTwat.likedBy,
            comments: updatedTwat.comments
          })
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            done();
            callback(test);
          });
      });
    });
  });
};
