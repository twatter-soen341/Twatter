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
    "firstName": "test",
    "lastName": "test",
    "email": "test@test.com",
    "password": "test"
}
const userCredentials = {
    "email": "test@test.com",
    "password": "test"
}

var newUserId = '';

const newUser1 = {
    "firstName": "test1",
    "lastName": "test1",
    "email": "test1@test.com",
    "password": "test1"
}
const userCredentials1 = {
    "email": "test1@test.com",
    "password": "test1"
}

var newUser1Id = '';

var twat1 = {   user: `${authenticatedUserID}`,
               timeStamp: Date.now(),
               content: 'First test Content',
               likedBy: [],
               comments: [],
           };

var twat2 = {   user: `${authenticatedUserID}`,
               timeStamp: Date.now(),
               content: 'Second test Content',
               likedBy: [],
               comments: [],
           };

var twatID = '';

// Configure chai
chai.use(chaiHttp);

chai.should();

describe("Authentication", () => {
    // Test for user signing up to twatter
    describe("POST /api/auth/signup", () => {
        let hashedPassword = '';

        it("should create new users", (done) =>{
            chai.request(app)
                .post('/api/auth/signup')
                .send(newUser)
                .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.message).to.equal('Sign up success!');
            hashedPassword = response.body.auth.password;
            newUserId = response.body.auth.user;
            });

            chai.request(app)
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
        it("should have hashed the password", done => {
            expect(hashedPassword).to.not.equal('test');
            done()
        })

        // The email should be unique, so an error should be thrown if not unique
        it("should not create multiple users with same email", done => {
            chai.request(app)
                .post('/api/auth/signup')
                .send(newUser)
                .end((err, response) => {
            expect(response.statusCode).to.equal(500);
            expect(response.body.message).to.equal('Sign up Failed.')
            done();
            });
        })
    });

    // Test for user login to Twatter
    describe("POST /api/auth/login", () => {

        it("should log in with valid credentials (user1)", (done) =>{
            chai.request(app)
                .post('/api/auth/login')
                .send(userCredentials)
                .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            authenticatedUserID = response.body.userId
            authenticatedUserJWT = response.body.token
            done();
            });
        });

        it("should log in with valid credentials (user2)", (done) =>{
            chai.request(app)
                .post('/api/auth/login')
                .send(userCredentials1)
                .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            authenticatedUserID1 = response.body.userId
            authenticatedUserJWT1 = response.body.token
            done();
            });
        });

        it("should NOT log in with invalid credentials", (done) =>{
            let invalidCredentials = {
                "email": "test@test.com",
                "password": "wrong password"
            }
            chai.request(app)
                .post('/api/auth/login')
                .send(invalidCredentials)
                .end((err, response) => {
            expect(response.statusCode).to.equal(401); // Not Authorized
            done();
            });
        });
    });
});

describe("Twats", () => {

    describe("POST /api/twat/", () => {

            // test twat creation
            it("should create a twat", (done) =>{
                //create a twat
                chai.request(app)
                    .post('/api/twat/')
                    .send(twat1)
                    .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                    .end((err, res) =>{
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        twatID = res.body.postId;
                    })

                //create second twat
                chai.request(app)
                    .post('/api/twat/')
                    .send(twat2)
                    .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                    .end((err, res) =>{
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        done();
                    })
            });

    });

    describe("POST /api/twat/search", () => {
                // find twat with keyword "First"
                it("should find a twat given a keyword", (done) =>{
                    chai.request(app)
                        .post('/api/twat/search')
                        .send({search: 'First'})
                        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                        .end((err, res) =>{
                            res.should.have.status(200);
                            assert.isTrue(res.body.length > 0)
                            done();
                        });
                });

                // error if a twat for the given keyword is not found
                it("should not find a twat given a keyword", (done) =>{
                    chai.request(app)
                        .post('/api/twat/search')
                        .send({search: 'invalid'})
                        .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                        .end((err, res) =>{
                            res.should.have.status(404);
                            done();
                        });
                });
        });

    describe("GET /api/twat", () => {

        // test to fetch all twats
        it("should get all twats", (done) =>{
            chai.request(app)
                .get('/api/twat/')
                .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        });

    });

    describe("GET /api/twat/:id", () => {
            // test fetching a specfic twat
            it("should get twat with specific id", (done) =>{
                chai.request(app)
                    .get(`/api/twat/${twatID}`)
                    .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                    .end((err, res) =>{
                        res.should.have.status(200);
                        // Verifying the content of twat returned
                        assert.equal(res.body.twat._id, twatID);
                        assert.equal(res.body.twat.content, 'First test Content');
                        done();
                    })
            });

            // error if the request is for an inexistant twat
            it("should return an error when the twat id is invalid", (done) =>{
                chai.request(app)
                    .get(`/api/twat/1`)
                    .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                    .end((err, res) =>{
                        res.should.have.status(500);
                        done();
                    })
            });

        });

    describe("GET /api/twat/user/:id", () => {
            // test to fetch all twats of a specific user
            it("should get all twats of specific user", (done) =>{
                chai.request(app)
                    .get(`/api/twat/user/${authenticatedUserID}`)
                    .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                    .end((err, res) =>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    })
            });

    });

});

describe("Users", () => {

    describe('GET /search/:id', (done) => {

        it('should return the user by id', (done) => {
        chai.request(app)
            .get(`/api/user/search/${authenticatedUserID}`)
            .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
            .end((err, res) =>{
                res.should.have.status(200);
                // Verifying the content of user returned
                assert.equal(res.body._id, authenticatedUserID);
                assert.equal(res.body.firstName, 'test');
                assert.equal(res.body.lastName, 'test');
                done();
            })
        });

        // if the user is not logged in we should get a 401 error
        it('should return a 401 response if the users is not authenticated', (done) => {
        chai.request(app)
            .get(`/api/user/search/${authenticatedUserID}`)
            .end((err, res) =>{
                res.should.have.status(401);  // missing the JWT token
                done();
            })
        });
    });

    describe('POST /search', (done) => {

        const searchTerm = { search : 'test'};

        it('should return array of users with test as last name or first name', (done) => {
        chai.request(app)
            .post('/api/user/search')
            .send(searchTerm)
            .set('Authorization', `Bearer ${authenticatedUserJWT}`) // setting JWT token in header
            .end((err, res) =>{
                res.should.have.status(200);
                assert.isTrue(res.body.length > 0)
                done();
            })
        });

        it('should return a 401 response if the users is not authenticated', (done) => {
        chai.request(app)
            .post('/api/user/search')
            .send(searchTerm)
                .end((err, res) =>{
                    res.should.have.status(401);  // missing the JWT token
                    done();
                })
            });
    });

    describe('PUT /follow-user/', (done) => {

            it('should follow given user', (done) => {

            chai.request(app)
                .put(`/api/user/follow-user/`)
                .send({wantToFollow: newUser1Id, user_id : newUserId})
                .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            });
        });

    describe('GET /followers/:id', (done) => {

            it('should return the followers of a given user', (done) => {
            chai.request(app)
                .get(`/api/user/followers/${newUser1Id}`)
                .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            });

        });

});

describe('Core Feature: Posting a Twat', () => {
  describe('As a User, I want to create a twat so that everyone who follows me can see. #25', () => {
    it('should create a twat', done => {
      // test here
      done();
    });
  });

  describe('As a user, I want to modify my twat so that I can make changes. #80', () => {
      it('should update a twat', done => {
        // test here
        done();
      });
    }
  );

  describe('As a user, I want to delete my twat so that i can never see it again. #81', () => {
      it('should delete a twat', done => {
        // test here
        done();
      });
    }
  );
});

describe('Core Feature: Liking a Twat', () => {

    describe('As a user, I want to like a Tweet so that I can show my appreciation to the poster. #38', () => {

        it('should like a twat', (done) => {
        let updatedTwat = {content: twat1.content, likedBy: [newUserId], comments: twat1.comments};
              chai.request(app)
              .put(`/api/twat/${twatID}`)
              .send({content: updatedTwat.content, likedBy: updatedTwat.likedBy, comments: updatedTwat.comments})
              .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
              .end((err, res) =>{
                  res.should.have.status(200);
              done();
            });
          });
        });

    describe('As a user, I want to know which user liked my tweet #83', () => {
          it('should show the users that liked a twat', done => {
            chai.request(app)
            .get(`/api/twat/${twatID}`)
            .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
            .end((err, res) =>{
                res.should.have.status(200);
                // Verifying that the twat has been correctly updated
                assert.equal(res.body.twat._id, twatID);
                console.log(res.body.twat.likedBy);
                assert.equal(JSON.stringify(res.body.twat.likedBy), JSON.stringify([newUserId]));
                done();
          });
        }
      );
    });

    describe('As a user I would like to unlike a post so that I can remove my appreciation from the post #179', () => {
      it('should unlike a twat', done => {
      let newList = [newUserId].filter(function(value, index, arr){
          return value != newUserId;
      });
      let updatedTwat = {content: twat1.content, likedBy: newList, comments: twat1.comments};
          chai.request(app)
          .put(`/api/twat/${twatID}`)
          .send({content: updatedTwat.content, likedBy: updatedTwat.likedBy, comments: updatedTwat.comments})
          .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
          .end((err, res) =>{
              res.should.have.status(200);
              done();
          });
        });
    });

});

describe('Core Feature: Commenting on a Twat', () => {
  describe(
  'As a User, I want to comment on a tweet, edit my comment and delete my comment so that I can give my opinion on the other User\'s Tweet (#129, #138, #140)', () => {
      it('should add/edit user\'s comment', done => {
        let updatedTwat = {content: twat1.content, likedBy: twat1.likedBy, comments: [{userId:`${newUserId}`, text: "comment1"}]};
              chai.request(app)
              .put(`/api/twat/${twatID}`)
              .send({content: updatedTwat.content, likedBy: updatedTwat.likedBy, comments: updatedTwat.comments})
              .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
              .end((err, res) =>{
                  res.should.have.status(200);
              done();
            });
      });
    });

});

describe("Deleting created test user", () => {

    describe("DELETE /api/auth", () => {

        it("should delete the created test users", (done) =>{
            chai.request(app)
                .delete('/api/auth/')
                .set('Authorization', `Bearer ${authenticatedUserJWT}`) //setting JWT token in header
                .send(userCredentials)
                .end((err, response) => {
                    expect(response.statusCode).to.equal(200);
                    expect(response.body.message).to.equal('Deleted successfully!');
                    done();
                });
        });

        it("should delete the created test users", (done) =>{
            chai.request(app)
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