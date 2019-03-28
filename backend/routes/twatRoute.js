const express = require('express');

const router = express.Router();

const twatController = require('../controllers/twatController');

/**
 * This route should be used to create a post (twat)
 */
router.post('/', twatController.createTwat);

/**
 * This route should be used to search for a post (twat)
 */
router.post('/search', twatController.getTwatsByMatch);

/**
 * This route should be used to retrieve a collection of post (twat) from all users
 */
router.get('/', twatController.getTwats);


/**
 * This route should be used to get a post (twat) with a specific id
 */
router.get('/:id', twatController.getTwat);

/**
 * This route should be used to retireve a post (twat) from a user only, used for profile page
 */
router.get('/user/:id', twatController.getTwatsForUser);

/**
 * This route should be used to update a post (twat)
 */
router.put('/:id', twatController.updateTwat);

/**
 * This route should be used to delete a post (twat)
 */
router.delete('/:id', twatController.deleteTwat);

module.exports = router;

