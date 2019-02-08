const express = require('express');

const router = express.Router();
const twatController = require('../controllers/twatController');

router.post('/', twatController.createTwat);

router.get('/:id', twatController.getTwat);

router.put('/:id', twatController.updateTwat);

router.delete('/:id', twatController.deleteTwat);

module.exports = router;

