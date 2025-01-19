const express = require('express');
const router = express.Router();
const profileController = require('../controllers/prof_settController');
const signoutController = require('../controllers/signoutController');

// GET route to render the profile settings page
router.get('/:username', profileController.getProfileSettings);

// POST route to handle profile settings update
router.post('/:username', profileController.updateProfileSettings);
router.post('/:username/delete', async (req, res, next) => {
    try {
      await profileController.deleteAccount(req, res);
      await signoutController(req, res);
      res.redirect('/');
    } catch (error) {
      next(error); 
    }
  });
module.exports = router;
