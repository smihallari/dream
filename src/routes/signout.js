const express = require('express');
const router = express.Router();
const signoutController = require('../controllers/signoutController');

// POST route for signout
router.post('/', async (req, res, next) => {
  try {
    // Execute the signout logic
    await signoutController(req, res);

    // After signing out, render the index view
    res.redirect('/');
  } catch (error) {
    // Handle any errors during signout
    next(error); // Pass error to error-handling middleware
  }
});
module.exports = router;