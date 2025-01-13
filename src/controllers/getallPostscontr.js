const express = require('express');
const authentication = require('./authenticationWare');
const router = express.Router();
const Post = require('../models/post');


router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('comments').lean();

    // Map posts to include the number of likes & comments

    const postsWithCounts = posts.map(post => ({
        ...post,
        likesCount: post.likes.length, 
        commentsCount: post.comments.length,
        hasLiked: userId ? post.likes.some(id => id.equals(userId)) : false
      }));

    res.render('posts', { posts: postsWithCounts });
  } catch (err) {
    console.error('Error fetching the post:', err);
    res.status(500).send('Server error');
  }
});
// Like a post (authentication required)
router.post('/posts/:id/like', authentication, async (req, res) => {
    try{
        const userId = req.user._id;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const hasLiked = post.likes.some(id => id.equals(userId));

        if (hasLiked) {
            post.likes = post.likes.filter(id => !id.equals(userId));
        } else {
            post.likes.push(userId);
        }
        await post.save();
        res.json({ message: hasLiked ? 'Post unliked' : 'Post liked', likesCount: post.likes.length });
    }catch (err) {
        console.error('Error liking the post:', err);
        res.status(500).send('Server error');
    }
});
module.exports = router;
