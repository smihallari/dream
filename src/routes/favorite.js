const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const profileUser = await User.findOne({ username });
    if (!profileUser) {
      return res.status(404).render('error', {
        message: 'User not found.',
        error: { status: 404 },
      });
    }
    
    // Fetch the posts that are in the user's favorites
    const posts = await Post.find({ _id: { $in: profileUser.favorites } })
    .select('title content createdAt author') // Include specific fields
    .populate('author', 'username') // Populate the post's author with their username
    .lean();
    res.render('favorites', {
      profileUser,
      posts
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).render('error', {
      message: 'Error loading favorites.',
      error: { status: 500 },
    });
  }
});

module.exports = router;
