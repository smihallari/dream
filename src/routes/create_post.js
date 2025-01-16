const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/makePost'); // Import only the function
const multer = require('multer');
const Post = require('../models/post');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  const posts = await Post.find()
  .populate('author', 'name') 
  .select('title category author') 
  .lean();

  if(req.isLoggedIn){
    res.render('create_post', { isLoggedIn: req.isLoggedIn, username: req.user.username });
  }
  else{
    res.render('dreamList',{ isLoggedIn: req.isLoggedIn, user: req.user,posts });
  }});

router.post('/create', upload.single('image'), createPost);
module.exports = router;