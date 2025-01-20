const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route: Get user profile
router.get('/:username', profileController.getUserProfile);

// Route: Make user admin
router.get('/:username/makeadmin', profileController.makeAdmin);

module.exports = router;
