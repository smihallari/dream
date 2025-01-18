const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// router.get('/', async (req, res) => {
//   const posts = await Post.find()
//   .populate('author', 'name') 
//   .select('title author date content image')
//   .limit(3)  
//   .lean();
//   res.render('index',{ 
//     isLoggedIn: req.isLoggedIn || false,
//     posts,
//     user: req.user || null
//   });
// });
// router.use('/posts', require('./posts'));

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name') 
      .select('title author date content image')
      .limit(3)
      .lean();
    res.render('index', { 
      isLoggedIn: req.isLoggedIn || false,
      posts: posts || [],
      user: req.user || null,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.render('index', { 
      isLoggedIn: req.isLoggedIn || false,
      posts: [], // Return empty array in case of error
      user: req.user || null,
    });
  }
});
module.exports = router;