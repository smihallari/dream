const express = require('express');
const router = express.Router();
const profileController = require('../controllers/prof_settController');
const signoutController = require('../controllers/signoutController');


router.get('/:username', profileController.getProfileSettings);


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
