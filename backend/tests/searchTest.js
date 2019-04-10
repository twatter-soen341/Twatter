// Import the dependencies for testing
const chai = require('chai');
const assert = require('chai').assert;
const app = require('../server');

exports.searchTests = function(test, callback) {
  describe('Feature: Search a User/Twat', () => {
    describe('As a User, I want to search for a Post so that I can easily be directed to that post. #145', () => {
      // find twat with keyword "First"
      it('should find a twat given a keyword', done => {
        chai
          .request(app)
          .post('/api/twat/search')
          .send({ search: 'Second' })
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            assert.equal(res.body.length, 1);
            assert.equal(res.body[0].content, 'Second test Content');
            done();
          });
      });

      // error if a twat for the given keyword is not found
      it('should return 404 not found if keyword is not in database', done => {
        chai
          .request(app)
          .post('/api/twat/search')
          .send({ search: 'invalid' })
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    describe('As a User, I want to find other users in a "search by name" bar so that I can follow their twats. #72', () => {
      it('should return array of users with test as last name or first name', done => {
        chai
          .request(app)
          .post('/api/user/search')
          .send({ search: 'test1' })
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) // setting JWT token in header
          .end((err, res) => {
            res.should.have.status(200);
            assert.equal(res.body.length, 1);
            assert.equal(res.body[0].firstName, 'test1');
            assert.equal(res.body[0].lastName, 'test1');
            assert.equal(res.body[0]._id, test.newUser1Id);
            done();
          });
      });

      it('should return 404 not found if keyword is not in database', done => {
        chai
          .request(app)
          .post('/api/twat/search')
          .send({ search: 'invalid' })
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) => {
            res.should.have.status(404);
            callback(test);
            done();
          });
      });
    });
  });
};
