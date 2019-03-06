// Import the dependencies for testing
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const app = require('../server');
const User = require('../models/user');
const mongoose = require('mongoose');


// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Twats", () => {

    describe("GET /api/twat", () => {

        // test to fetch all twats
        it("should get all twats", (done) => {
            chai.request(app)
                .get('/api/twat/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        });
    });
});


describe('Test Database', () => {
    //Save object with 'name' value of 'Mike"
    it('New name saved to test database', (done) => {
        var testUser = User({
            firstName: 'Mike',
            lastName: 'Rogers'
        });

        testUser.save(done);
    });

    it('Should retrieve data from test database', (done) => {
        //Look up the 'Mike' object previously saved.
        User.find({ firstName: 'Mike' }, (err, name) => {
            if (err) { throw err; }
            if (name.length === 0) { throw new Error('No data!'); }
            done();
        });
    });


    //After all tests are finished drop database and close connection
    after((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });

});




