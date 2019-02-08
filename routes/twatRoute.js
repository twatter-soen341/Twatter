const express = require('express');

const router = express.Router();
const twatController = require('../controllers/twatController');

router.post('/', twatController.createTwat);
router.get('/', twatController.getTwat);

module.exports = router;

