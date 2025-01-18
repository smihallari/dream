const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const Post = require('../models/post');
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }); 

    if (!user) {
      return res.status(404).send('User not found');
    }
    const posts = await Post.find({ author: user._id }) 
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('author', 'name') 
      .select('title content image ') 
      .lean();
    res.render('profile', { user, isLoggedIn: req.isLoggedIn,posts });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load profile');
  }
});



module.exports = router;