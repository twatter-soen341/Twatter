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

// Configure chai
chai.use(chaiHttp);

chai.should();

describe("Authentication", () => {
    // Test for user signing up to twatter
    describe("GET /api/auth/signup", () => {
        let hashedPassword = '';

        it("should create a new user", (done) =>{
            chai.request(app)
                .post('/api/auth/signup')
                .send(newUser)
                .end((err, response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.message).to.equal('Sign up success!');
            hashedPassword = response.body.auth.password;
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
    describe("GET /api/auth/login", () => {
        
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
});

describe("Deleting created test user", () => {
    
    describe("DELETE /api/auth", () => {

        it("should delete the created test user", (done) =>{
            chai.request(app)
                .delete('/api/auth/')
                .send(userCredentials)
                .end((err, response) => {
                    expect(response.statusCode).to.equal(200);
                    expect(response.body.message).to.equal('Deleted successfully!')
                    done();
                });
        });
    });
});