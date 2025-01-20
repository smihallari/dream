const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404; 
      return next(error);
    }
    const userId = req.user._id;
    const comments = await Comment.find({ post: req.params.id }).populate('author');
    const index = post.likes.indexOf(userId);
    let liked = false;
    if (index === -1) {
      post.likes.push(userId);
      liked = true;
    } else {
      post.likes.splice(index, 1);
      liked = false;
    }
    res.render('post', { post, comments,liked });
  } catch (error) {
    error.message = 'Server error';
    error.status = 500;
    next(error);
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send('Comment cannot be empty');
    }

    const newComment = new Comment({
      text: comment,
      post: req.params.id,
      author: req.user._id, 
    });
    await newComment.save();
    res.redirect(`/oneDream/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate();
    if (!post) {
      return res.status(404).send('Post not found');
    }
    const userId = req.user.id;
    const index = post.likes.indexOf(userId);
    let liked = false;
    if (index === -1) {
      post.likes.push(userId);
      liked = true;
    } else {
      post.likes.splice(index, 1);
      liked = false;
    }
    const comments = await Comment.find({ post: req.params.id }).populate('author');
    await post.save();
    res.render('post', { post, comments, liked });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to like post');
  }
});

module.exports = router;