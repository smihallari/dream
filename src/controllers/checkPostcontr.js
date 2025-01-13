const express = require('express');
const authentication = require('./authenticationWare');
const router = express.Router();
// Comment on a post (authentication required)
router.post('/posts/:id/comment', authentication, (req, res) => {
    const { comment } = req.body;
    const post = posts.find(p => p.id == req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
  
    post.comments.push({ user: req.user.id, comment });
    res.json({ message: 'Comment added', post });
  });
  
  module.exports = router;