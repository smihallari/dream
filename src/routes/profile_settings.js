const express = require('express');
const router = express.Router();
const profileController = require('../controllers/prof_settController');

// GET route to render the profile settings page
router.get('/:username', profileController.getProfileSettings);

// POST route to handle profile settings update
router.post('/:username', profileController.updateProfileSettings);

module.exports = router;
