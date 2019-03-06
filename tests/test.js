// Import the dependencies for testing
const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const app = require('../server');

// needed for protected routes
let authenticatedUserID;
let authenticatedUserJWT;
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


// Configure chai
chai.use(chaiHttp);

chai.should();

describe("Authentication", () => {
    // Test for user signing up to twatter
    describe("POST /api/auth/signup", () => {
        let hashedPassword = '';

        it("should create a new user", (done) =>{
            chai.request(app)
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

        it("should successfully create a second user", (done) =>{
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

        it("should log in with valid credentials", (done) =>{
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
    let twatID = '';

    describe("POST /api/twat/", () => {

        let twat1 = {   user: `${authenticatedUserID}`,
                       timeStamp: Date.now(),
                       content: 'First test Content',
                       likedBy: [],
                       comments: [],
                   };

        let twat2 = {   user: `${authenticatedUserID}`,
                       timeStamp: Date.now(),
                       content: 'Second test Content',
                       likedBy: [],
                       comments: [],
                   };

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
                        assert.equal(res.body.post._id, twatID);
                        assert.equal(res.body.post.content, 'First test Content');
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

describe("Deleting created test user", () => {

    describe("DELETE /api/auth", () => {

        it("should delete the created test users", (done) =>{
            chai.request(app)
                .delete('/api/auth/')
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
                .send(userCredentials1)
                .end((err, response) => {
                    expect(response.statusCode).to.equal(200);
                    expect(response.body.message).to.equal('Deleted successfully!');
                    done();
                });
        });
    });
});



