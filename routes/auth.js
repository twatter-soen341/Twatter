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

router.delete('/', authController.deleteUser)

module.exports = router;
