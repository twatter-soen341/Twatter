// Import the dependencies for testing
const chai = require('chai');
const app = require('../server');

exports.commentTests = function(test, callback) {
  describe('Core Feature: Commenting on a Twat', () => {
    describe("As a User, I want to comment on a tweet, edit my comment and delete my comment so that I can give my opinion on the other User's Tweet (#129, #138, #140)", () => {
      it("should add/edit user's comment", done => {
        let updatedTwat = {
          content: test.twat1.content,
          likedBy: test.twat1.likedBy,
          comments: [{ userId: `${test.newUserId}`, text: 'comment1' }]
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
            callback(test);
            done();
          });
      });
    });
  });
};
