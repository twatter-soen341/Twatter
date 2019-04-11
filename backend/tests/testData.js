// needed for protected routes
let authenticatedUserID;
let authenticatedUserJWT;
let authenticatedUserJWT1;
let newUserId = '';
let newUser1Id = '';

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

var twat1 = { user: `${authenticatedUserID}`, content: 'First test Content' };

var twat2 = { user: `${authenticatedUserID}`, content: 'Second test Content' };

var twat2ID = '';

let testData = {
  authenticatedUserID: authenticatedUserID,
  authenticatedUserJWT: authenticatedUserJWT,
  authenticatedUserJWT1: authenticatedUserJWT1,
  newUserId: newUserId,
  newUser1Id: newUser1Id,
  newUser: newUser,
  userCredentials: userCredentials,
  newUser1: newUser1,
  userCredentials1: userCredentials1,
  twat1: twat1,
  twat2: twat2,
  twat2ID: twat2ID
};

module.exports = testData;
