const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', async (req, res) => {
  const posts = await Post.find()
  .populate('author', 'username image') 
  .select('title category author image') 
  .lean();

  res.render('dreamList',{ isLoggedIn: req.isLoggedIn, user: req.user,posts });
});
router.use('/posts', require('./posts'));

module.exports = router;