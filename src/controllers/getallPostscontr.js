const express = require('express');
const authentication = require('../middleware/authenticationWare');
const router = express.Router();
const Post = require('../models/post');

router.get('/', async (req, res) => {
  try {
    const { order } = req.query;
    const userId = req.user ? req.user._id : null;
    
    let posts;

    if (order === 'hot') {
      const hours = 6;
      const HoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

      posts = await Post.find()
        .populate('comments')
        .lean();

      // Filter likes within the last 6 hours and count them
      const postsWithCounts = posts.map(post => {
        const recentLikes = post.likes.filter(like => new Date(like.timestamp) >= sixHoursAgo);
        return {
          ...post,
          likesCount: post.likes.length,
          recentLikesCount: recentLikes.length,
          commentsCount: post.comments.length,
          hasLiked: userId ? post.likes.some(like => like.user.equals(userId)) : false
        };
      });

      // Sort posts by 6 hours ago likes in descendng order
      postsWithCounts.sort((a, b) => b.recentLikesCount - a.recentLikesCount);
      res.render('posts', { posts: postsWithCounts });

    } else {
      // newest or oldest posts
      const sortCriteria = order === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
      posts = await Post.find().populate('comments').sort(sortCriteria).lean();

      const postsWithCounts = posts.map(post => ({
        ...post,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        hasLiked: userId ? post.likes.some(like => like.user.equals(userId)) : false
      }));

      res.render('posts', { posts: postsWithCounts });
    }
  } catch (err) {
    console.error('Error fetching posts:', err);
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
