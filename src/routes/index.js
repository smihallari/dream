const express = require('express');
const router = express.Router();
const Post = require('../models/post');
router.get('/', async (req, res) => {
  const posts = await Post.find()
  .populate('author', 'name') 
  .select('title author date content image')
  .limit(3)  
  .lean();
  res.render('index',{ isLoggedIn: req.isLoggedIn, user: req.user,posts });
});
router.use('/posts', require('./posts'));

module.exports = router;