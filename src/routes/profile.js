const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

router.get('/:username', async (req, res) => {
  try {
    
    const user = await User.findOne({ username: req.params.username }); 
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('profile', { user, isLoggedIn: req.isLoggedIn });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load profile');
  }
});

module.exports = router;