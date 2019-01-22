const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.get('/user', passport.authenticate('jwt', {session: false}), authController.getUser);

module.exports = router;