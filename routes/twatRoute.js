const express = require('express');

const router = express.Router();
const twatController = require('../controllers/twatController');

router.post('/', twatController.createTwat);

router.post('/search', twatController.getTwatsByMatch);

router.get('/', twatController.getTwats);

router.get('/:id', twatController.getTwat);

router.get('/user/:id', twatController.getTwatsForUser);

router.put('/:id', twatController.updateTwat);

router.delete('/:id', twatController.deleteTwat);

module.exports = router;

