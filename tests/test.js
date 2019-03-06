// Import the dependencies for testing
const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const app = require('../server');

// needed for protected routes
let authenticatedUserID;
let authenticatedUserJWT;
const userCredentials = {
    "email": "test@test.com",
    "password": "test"
}

// Configure chai
chai.use(chaiHttp);

chai.should();

// Runs before each test to authenticate a test user
before( (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send(userCredentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(200);
        authenticatedUserID = response.body.userId
        authenticatedUserJWT = response.body.token
        done();
    });
});

after( (done) => {
    authenticatedUserID = null;
    authenticatedUserJWT = null;
    done();
});

describe("Twats", () => {
    
    describe("GET /api/twat", () => {

        // test to fetch all twats
        it("should get all twats", (done) =>{
            chai.request(app)
                .get('/api/twat/')
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
        //addresses 1st bullet point: if the user is logged in we should get a 200 status code
        it('should return a 200 response if the user is authenticated', (done) => {
        chai.request(app)
            .get(`/api/user/search/${authenticatedUserID}`)
            .set('Authorization', `Bearer ${authenticatedUserJWT}`)
            .end((err, res) =>{
                res.should.have.status(200);
                // Verifying the content of user returned
                assert.equal(res.body._id, authenticatedUserID);
                assert.equal(res.body.firstName, 'test');
                assert.equal(res.body.lastName, 'test');
                done();
            })
        });
        //addresses 2nd bullet point: if the user is not logged in we should get a 402 error
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
        //addresses 1st bullet point: if the user is logged in we should get a 200 status code
        it('should return a 200 response if the user is authenticated', (done) => {
        chai.request(app)
            .post('/api/user/search')
            .send(searchTerm)
            .set('Authorization', `Bearer ${authenticatedUserJWT}`)
            .end((err, res) =>{
                res.should.have.status(200);
                assert.equal(res.body.length, 1)
                assert.equal(res.body[0].firstName, 'test');
                assert.equal(res.body[0].lastName, 'test');
                done();
            })
        });
        //addresses 2nd bullet point: if the user is not logged in we should get a 402 error
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
