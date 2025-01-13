const express = require('express');
const authentication = require('./authenticationWare');
const router = express.Router();
const Post = require('../models/post');


router.get('/', async (req, res) => {
  try {
    // Fetch all posts along with the count of comments
    const posts = await Post.find().populate('comments').lean();

    // Map posts to include the number of comments
    const postsWithCounts = posts.map(post => ({
      ...post,
      commentsCount: post.comments.length
    }));

    res.render('posts', { posts: postsWithCounts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Server error');
  }
});
// Like a post (authentication required)
router.post('/posts/:id/like', authentication, (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.likes += 1;
  res.json({ message: 'Post liked', post });
});

// Comment on a post (authentication required)
router.post('/posts/:id/comment', authentication, (req, res) => {
  const { comment } = req.body;
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.comments.push({ user: req.user.id, comment });
  res.json({ message: 'Comment added', post });
});

module.exports = router;
