// Import the dependencies for testing
const chai = require('chai');
const expect = require('chai').expect;
const app = require('../server');

exports.tearDown = function(test) {
  describe('Deleting created test user', () => {
    describe('DELETE /api/auth', () => {
      it('should delete the created test users', done => {
        chai
          .request(app)
          .delete('/api/auth/')
          .set('Authorization', `Bearer ${test.authenticatedUserJWT}`) //setting JWT token in header
          .send(test.userCredentials)
          .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.message).to.equal('Deleted successfully!');
            done();
          });
      });
    });

    it('should delete the created test users', done => {
      chai
        .request(app)
        .delete('/api/auth/')
        .set('Authorization', `Bearer ${test.authenticatedUserJWT1}`) //setting JWT token in header
        .send(test.userCredentials1)
        .end((err, response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.message).to.equal('Deleted successfully!');
          done();
        });
    });
  });
};
