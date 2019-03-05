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

/**
 * This route should be used to follow a user
 * @throws exception when ...
 */
router.put('/follow-user', userController.followUser); // TODO: add auth 

/**
 * This route should be used to unfollow a user
 * @throws exception when ...
 */
router.put('/unfollow-user', userController.unfollowUser); // TODO: add auth

/**
 * This route should be used to get the array of followers
 * @throws exception when ...
 */
router.get('/followers/:id', userController.getFollowers);

/**
 * This route should be used to get the array of following
 * @throws exception when ...
 */
router.get('/following/:id', userController.getFollowing);

/**
 * This route should be used to find a group of users by id, a group of user id is sent and a group of users object is sent back
 *  @throws exception when ...
 */
router.post('/users', passport.authenticate('jwt', { session: false }), userController.getUsersByIds);

module.exports = router;