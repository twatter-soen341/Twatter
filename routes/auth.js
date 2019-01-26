const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controllers/authController');

/**
 * This route should be used to validate an existing user's credentials
 * @throws exception when credentials are invalid
 */
router.post('/login', authController.login);

/**
 * This route should be used to create a new user in the db.
 * @throws exception when email is not unique
 */
router.post('/signup', authController.signup);

/**
 * This route responds with the data encrypted in the jwt token
 */
router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  authController.getUser
);

module.exports = router;
