const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controllers/auth');

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
 * This route should be used to delete a user's account
 * Username and password must be sent in the body to authenticate the user
 * @throws exception when credentials are invalid
 */
router.delete('/', passport.authenticate('jwt', { session: false }), authController.deleteUser);

/**
 * This route should be used to change a user's password
 * Username and password must be sent in the body to authenticate the user
 * @throws exception when credentials are invalid
 */
router.put('/pass', passport.authenticate('jwt', { session: false }), authController.changePassword);

/**
 * This route should be used to change a user's email
 * Username and password must be sent in the body to authenticate the user
 * @throws exception when credentials are invalid
 */
router.put('/email', passport.authenticate('jwt', { session: false }), authController.changeEmail);

module.exports = router;
