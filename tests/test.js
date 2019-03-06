// Import the dependencies for testing
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const app = require('../server');

// Configure chai
chai.use(chaiHttp);

chai.should();

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

