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

      // filter likes within the last 6 hours and count them
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

      // sorts posts by 6 hours ago likes in descendng order
      postsWithCounts.sort((a, b) => b.recentLikesCount - a.recentLikesCount);
      res.render('posts', {  posts: postsWithCounts });

    } else {
      const sortCriteria = order === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
      posts = await Post.find().populate('comments').sort(sortCriteria).lean();

      const postsWithCounts = posts.map(post => ({
        ...post,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        hasLiked: userId ? post.likes.some(like => like.user.equals(userId)) : false
      }));

      res.render('posts', {  posts: postsWithCounts });
    }
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Server error');
  }
});

// auth required to like a post
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

// exports.getFilteredPosts = async (req, res) => {
//   try {
//     const { category, author, date } = req.query; // filter parameters
//     const filters = {};

//     if (category) filters.category = category;
//     if (author) filters.author = author;
//     if (date) filters.createdAt = { $gte: new Date(date) };

//     const posts = await Post.find(filters)
//       .sort({ createdAt: -1 }) // sort by latest
//       .limit(10); // pagination per 10 posts

//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching posts', error });
//   }
// };


// const Post = require('../models/post');

// exports.getFilteredPosts = async (req, res) => {
//   try {
//     const { category, user, date } = req.query; // Read query parameters
//     const filters = {};

//     if (category) {
//       filters.category = category; // match category
//     }
//     if (author) {
//       filters.author = author; // match user ID or username
//     }
//     if (date) {
//       const parsedDate = new Date(date);
//       filters.createdAt = { 
//         $gte: parsedDate, // start date
//         $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000), // end of the same day
//       };
//     }

//     // query the database with the filter
//     const posts = await Post.find(filters)
//       .sort({ createdAt: -1 }) // Sort by newest
//       .exec();

//     // Send the filtered posts as a response
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error('Error fetching filtered posts:', error);
//     res.status(500).json({ message: 'Error fetching posts', error });
//   }
// };
