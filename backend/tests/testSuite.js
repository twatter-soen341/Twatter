// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');

let testData = require('./testData');

// Configure chai
chai.use(chaiHttp);

chai.should();

const authTest = require('./authTest').authenticationTests;
const twatTest = require('./twatTest').twatTests;
const likeTest = require('./likeTest').likeTests;
const followTest = require('./followTest').followTests;
const searchTest = require('./searchTest').searchTests;
const commentTest = require('./commentTest').commentTests;
const tearDown = require('./tearDown').tearDown;

authTest(testData, function(authTestResults) {
  twatTest(authTestResults, function(twatTestResults) {
    likeTest(twatTestResults, function(likeTestResults) {
      searchTest(likeTestResults, function(searchTestResults) {
        followTest(searchTestResults, function(followTestResults) {
          commentTest(followTestResults, function(commentTestResults) {
            tearDown(commentTestResults);
          });
        });
      });
    });
  });
});
