const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }); 
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('profile_settings', { user, isLoggedIn: req.isLoggedIn  });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load profile settings');
  }
});
router.post('/:username', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
        return res.status(404).send('User not found');
      }
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      }
      await user.save();
      res.redirect(`/profile/${user.username}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to update profile settings');
    }
  });
module.exports = router;