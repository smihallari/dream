const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/makePost');
const multer = require('multer');
const Post = require('../models/post');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  const posts = await Post.find()
  .populate('author', 'name') 
  .select('title category author') 
  .lean();

  if(req.isLoggedIn){
    res.render('postdream', { isLoggedIn: req.isLoggedIn, username: req.user.username });
  }
  else{
    res.render('signin',{  isLoggedIn: req.isLoggedIn, user: req.user,posts });
  }});

router.post('/create', upload.single('dreamimage'), createPost);
module.exports = router;