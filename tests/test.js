// Import the dependencies for testing
const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const app = require('../server');

// needed for protected routes
let authenticatedUserID;
let authenticatedUserJWT;
let authenticatedUserID1;
let authenticatedUserJWT1;
const newUser = {
  firstName: 'test',
  lastName: 'test',
  email: 'test@test.com',
  password: 'test'
};
const userCredentials = {
  email: 'test@test.com',
  password: 'test'
};

var newUserId = '';

const newUser1 = {
  firstName: 'test1',
  lastName: 'test1',
  email: 'test1@test.com',
  password: 'test1'
};
const userCredentials1 = {
  email: 'test1@test.com',
  password: 'test1'
};

var newUser1Id = '';

// Configure chai
chai.use(chaiHttp);

chai.should();

describe('Authentication', () => {
  // Test for user signing up to twatter
  describe('POST /api/auth/signup', () => {
    let hashedPassword = '';

    it('should create a new user', done => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(newUser)
        .end((err, response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.message).to.equal('Sign up success!');
          hashedPassword = response.body.auth.password;
          newUserId = response.body.auth.user;
          done();
        });
    });

    it('should successfully create a second user', done => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(newUser1)
        .end((err, response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.message).to.equal('Sign up success!');
          newUser1Id = response.body.auth.user;
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
        .send(newUser)
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
        .send(userCredentials)
        .end((err, response) => {
          expect(response.statusCode).to.equal(200);
          authenticatedUserID = response.body.userId;
          authenticatedUserJWT = response.body.token;
          done();
        });
    });

    it('should log in with valid credentials (user2)', done => {
      chai
        .request(app)
        .post('/api/auth/login')
        .send(userCredentials1)
        .end((err, response) => {
          expect(response.statusCode).to.equal(200);
          authenticatedUserID1 = response.body.userId;
          authenticatedUserJWT1 = response.body.token;
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
          done();
        });
    });
  });
});

describe('Core Feature: Posting a Twat', () => {
  describe(`As a User, I want to create a twat so that everyone who follows me can see. #25`, () => {
    it('should create a twat', done => {
      const user = `${authenticatedUserID}`;
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
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          /* Testing the returned twat */
          res.should.have.status(201);
          res.body.should.be.a('object');
          assert.equal(res.body.message, 'Twat added successfully');
          twat1ID = res.body.postId;
        });

      //create second twat for future use
      chai
        .request(app)
        .post('/api/twat/')
        .send(twat2)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          assert.equal(res.body.message, 'Twat added successfully');
          twat2ID = res.body.postId;
          done();
        });
    });

    it('should get all twats', done => {
      chai
        .request(app)
        .get('/api/twat/')
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
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
        .get(`/api/twat/${twat1ID}`)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(200);
          // Verifying the content of twat returned
          assert.equal(res.body.twat._id, twat1ID);
          assert.equal(res.body.twat.content, 'First test Content');
          done();
        });
    });

    // error if the request is for an inexistant twat
    it('should return an error when the twat id is invalid', done => {
      chai
        .request(app)
        .get(`/api/twat/1`)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(500); //error
          done();
        });
    });

    // test to fetch all twats of a specific user
    it('should get all twats of specific user', done => {
      chai
        .request(app)
        .get(`/api/twat/user/${authenticatedUserID}`)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe(`As a user, I want to modify my twat so that I can make changes. #80`, () => {
    it('should update a twat', done => {
      const user = `${authenticatedUserID}`;
      /* Updating twat1 */
      twat2 = {
        userId: user,
        content: 'Second test Content (edited)',
        likedBy: [],
        comments: []
      };
      chai
        .request(app)
        .put(`/api/twat/${twat2ID}`)
        .send(twat2)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(200);
          // Verifying the content of twat returned
          assert.equal(res.body.message, 'Post Updated');
          done();
        });
    });
  });

  describe(`As a user, I want to delete my twat so that i can never see it again. #81`, () => {
    it('should delete a twat', done => {
      chai
        .request(app)
        .delete(`/api/twat/${twat1ID}`)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(200);
          // Verifying the content of twat returned
          assert.equal(res.body.message, 'Deleted successfully!');
        });

      /* Verifying that there are only 1 twat in the database */
      chai
        .request(app)
        .get('/api/twat/')
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          assert.equal(res.body.twats.length, 1);
          done();
        });
    });
  });
});

describe('Feature: Search a User/Twat', () => {
  describe('As a User, I want to search for a Post so that I can easily be directed to that post. #145', () => {
    // find twat with keyword "First"
    it('should find a twat given a keyword', done => {
      chai
        .request(app)
        .post('/api/twat/search')
        .send({ search: 'Second' })
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].content, 'Second test Content (edited)');
          done();
        });
    });

    // error if a twat for the given keyword is not found
    it('should return 404 not found if keyword is not in database', done => {
      chai
        .request(app)
        .post('/api/twat/search')
        .send({ search: 'invalid' })
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('As a User, I want to find other users in a "search by name" bar so that I can follow their posts. #72', () => {
    it('should return array of users with test as last name or first name', done => {
      chai
        .request(app)
        .post('/api/user/search')
        .send({ search: 'test1' })
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) // setting JWT token in header
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].firstName, 'test1');
          assert.equal(res.body[0].lastName, 'test1');
          assert.equal(res.body[0]._id, newUser1Id);
          done();
        });
    });

    it('should return 404 not found if keyword is not in database', done => {
      chai
        .request(app)
        .post('/api/twat/search')
        .send({ search: 'invalid' })
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

// describe('Twats', () => {
//   describe('PUT /follow-user/', done => {
//     it('should follow given user', done => {
//       chai
//         .request(app)
//         .put(`/api/user/follow-user/`)
//         .send({ wantToFollow: newUser1Id, user_id: newUserId })
//         .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
//         .end((err, res) => {
//           res.should.have.status(200);
//           done();
//         });
//     });
//   });

//   describe('GET /followers/:id', done => {
//     it('should return the followers of a given user', done => {
//       chai
//         .request(app)
//         .get(`/api/user/followers/${newUser1Id}`)
//         .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
//         .end((err, res) => {
//           res.should.have.status(200);
//           done();
//         });
//     });
//   });
// });

describe('Core Feature: Following A User', () => {
  describe('As a user, I want to follow/unfollow another user so that I can see their latest posts. #63', () => {
    it('should follow given user', done => {
      chai
        .request(app)
        .put(`/api/user/follow-user/`)
        .send({ wantToFollow: newUser1Id, user_id: newUserId })
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body.user.following.length, 1);
          assert.equal(res.body.user.following[0], newUser1Id);
          done();
        });
    });

    it('should not follow user that does not exist', done => {
      chai
        .request(app)
        .put(`/api/user/follow-user/`)
        .send({ wantToFollow: 'invalid', user_id: newUserId })
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
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
        .get(`/api/user/followers/${newUserId}`)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          assert.equal(res.body.followers.length, 0);
          res.should.have.status(200);
          done();
        });
    });

    it('should return the user I am following', done => {
      chai
        .request(app)
        .get(`/api/user/following/${newUserId}`)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          assert.equal(res.body.following.length, 1);
          assert.equal(res.body.following[0]._id, newUser1Id);
          res.should.have.status(200);
          done();
        });
    });

    it('should return an error if user given is invalid', done => {
      chai
        .request(app)
        .get(`/api/user/following/invalid`)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(500);
        });

        chai
        .request(app)
        .get(`/api/user/followers/invalid`)
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});

describe('Deleting created test user', () => {
  describe('DELETE /api/auth', () => {
    it('should delete the created test users', done => {
      chai
        .request(app)
        .delete('/api/auth/')
        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
        .send(userCredentials)
        .end((err, response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.message).to.equal('Deleted successfully!');
          done();
        });
    });

    it('should delete the created test users', done => {
      chai
        .request(app)
        .delete('/api/auth/')
        .set('Authorization', `Bearer ${authenticatedUserJWT1}`) //setting JWT token in header
        .send(userCredentials1)
        .end((err, response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.message).to.equal('Deleted successfully!');
          done();
        });
    });
  });
});
