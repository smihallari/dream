const express = require('express');
const router = express.Router();
const Post = require('../models/post'); 
const Comment = require('../models/comment'); // Ensure the Comment model is imported

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    .populate('author', 'username image')
    .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username image '
        }
      });
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('post', {  post, isLoggedIn: req.isLoggedIn, user: req.user,commentsAllowed: post.commentsAllowed });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load post');
  }
});

router.post('/:id/like', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      const userId = req.user._id;
      const index = post.likes.indexOf(userId);
      let liked = false;
      if (index === -1) {
        post.likes.push(userId);
        liked = true;
      } else {
        post.likes.splice(index, 1);
        liked = false;
      }
  
      await post.save();
      res.json({ likes: post.likes.length,liked });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to like post');
    }
  });
router.get('/:id/liked', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        const userId = req.user._id;
        const liked = post.likes.includes(userId);
        res.json({ liked });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to check like status');
    }
});
module.exports = router;