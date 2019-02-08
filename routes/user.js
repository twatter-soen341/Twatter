const express = require('express');
const passport = require('passport');

const router = express.Router();

const userController = require('../controllers/user');

/**
 * This route should be used to find users by id, works only when authenticated
 * @throws exception when ...
 */
router.get('/search/:id', passport.authenticate('jwt', { session: false }), userController.getUserById);

/**
 * This route should be used to find users by name(using regex), works only when authenticated
 * @throws exception when ...
 */
router.post('/search', passport.authenticate('jwt', { session: false }), userController.getUserByName);

module.exports = router;