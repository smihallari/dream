const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Post = require('../models/post');
const User = require('../models/user');



// Function to get the favorites for a user
const getFavoritesForUser = async (userId) => {
  try {
    const user = await User.findById(userId).populate('favorites'); 
    return user?.favorites || []; 
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw new Error('Unable to fetch favorites');
  }
};

// GET /favorite
router.get('/:username', async (req, res,next) => {
    try {
      const { username } = req.params;
      const profileUser = await User.findOne({ username: req.params.username });
      if (!profileUser) {
        return res.status(404).render('error', {
          message: 'User not found.',
          error: { status: 404 },
        });
      }
      const posts = await getFavoritesForUser(profileUser._id);
  
      res.render('favorites', {
        profileUser,
        posts,
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
