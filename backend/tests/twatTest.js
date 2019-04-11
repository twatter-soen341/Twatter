// Import the dependencies for testing
const chai = require('chai');
const assert = require('chai').assert;
const app = require('../server');

exports.twatTests = function(test, callback) {
  describe('Core Feature: Posting a Twat', () => {
    describe(`As a User, I want to create a twat so that everyone who follows me can see. #25`, () => {
      it('should create a twat', done => {
        const user = `${test.authenticatedUserID}`;
        let twat1 = {
          userId: user,
          content: 'First test Content'
        };

        let twat2 = {
          userId: user,
          content: 'Second test Content'
        };

        chai
          .request(app)
          .post('/api/twat/')
          .send(twat1)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            /* Testing the returned twat */
            res.should.have.status(201);
            res.body.should.be.a('object');
            assert.equal(res.body.message, 'Twat added successfully');
            test.twat1ID = res.body.twatId;
          });

        //create second twat for future use
        chai
          .request(app)
          .post('/api/twat/')
          .send(twat2)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            assert.equal(res.body.message, 'Twat added successfully');
            test.twat2ID = res.body.twatId;
            done();
          });
      });

      it('should get all twats', done => {
        chai
          .request(app)
          .get('/api/twat/')
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            assert.equal(res.body.twats.length, 2);
            done();
          });
      });

      it('should get twat with specific id', done => {
        chai
          .request(app)
          .get(`/api/twat/${test.twat1ID}`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            // Verifying the content of twat returned
            assert.equal(res.body.twat._id, test.twat1ID);
            assert.equal(res.body.twat.content, 'First test Content');
            done();
          });
      });

      // error if the request is for an inexistant twat
      it('should return an error when the twat id is invalid', done => {
        chai
          .request(app)
          .get(`/api/twat/1`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(500); //error
            done();
          });
      });

      // test to fetch all twats of a specific user
      it('should get all twats of specific user', done => {
        chai
          .request(app)
          .get(`/api/twat/user/${test.authenticatedUserID}`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          });
      });
    });

    describe(`As a user, I want to modify my twat so that I can make changes. #80`, () => {
      it('should update a twat', done => {
        const user = `${test.authenticatedUserID}`;
        /* Updating twat1 */
        twat2 = {
          userId: user,
          content: 'Second test Content (edited)',
          likedBy: [],
          comments: []
        };
        chai
          .request(app)
          .put(`/api/twat/${test.twat2ID}`)
          .send(twat2)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            // Verifying the content of twat returned
            assert.equal(res.body.message, 'Twat Updated');
            done();
          });
      });
    });

    describe(`As a user, I want to delete my twat so that i can never see it again. #81`, () => {
      it('should delete a twat', done => {
        chai
          .request(app)
          .delete(`/api/twat/${test.twat1ID}`)
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            // Verifying the content of twat returned
            assert.equal(res.body.message, 'Deleted successfully!');
            callback(test);
            done();
          });
      });
    });
  });
};
