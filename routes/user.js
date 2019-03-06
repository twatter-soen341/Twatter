const express = require('express');
const passport = require('passport');

const router = express.Router();

const userController = require('../controllers/user');

/**
 * This route should be used to find users by id, works only when authenticated
 */
router.get('/search/:id', userController.getUserById);

/**
 * This route should be used to find users by name(using regex), works only when authenticated
 */
router.post('/search', userController.getUserByName);

/**
 * This route should be used to follow a user
 */
router.put('/follow-user', userController.followUser);

/**
 * This route should be used to unfollow a user
 */
router.put('/unfollow-user/:id', userController.unfollowUser);

/**
 * This route should be used to get the array of followers
 */
router.get('/followers/:id', userController.getFollowers);

/**
 * This route should be used to get the array of following
 */
router.get('/following/:id', userController.getFollowing);

/**
 * This route should be used to find a group of users by id, a group of user id is sent and a group of users object is sent back
 */
router.post('/users', userController.getUsersByIds);

module.exports = router;