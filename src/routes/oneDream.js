// const express = require('express');
// const router = express.Router();
// const Post = require('../models/post'); 
// const Comment = require('../models/comment'); // Ensure the Comment model is imported

// router.get('/:id', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id)
//     .populate('author', 'username image')
//     .populate({
//         path: 'comments',
//         populate: {
//           path: 'author',
//           select: 'username image '
//         }
//       });
//     if (!post) {
//       return res.status(404).send('Post not found');
//     }
//     res.render('post', {  post, isLoggedIn: req.isLoggedIn, user: req.user,commentsAllowed: post.commentsAllowed });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Failed to load post');
//   }
// });

// router.post('/:id/like', async (req, res) => {
//     try {
//       const post = await Post.findById(req.params.id);
//       if (!post) {
//         return res.status(404).send('Post not found');
//       }
//       const userId = req.user._id;
//       const index = post.likes.indexOf(userId);
//       let liked = false;
//       if (index === -1) {
//         post.likes.push(userId);
//         liked = true;
//       } else {
//         post.likes.splice(index, 1);
//         liked = false;
//       }
  
//       await post.save();
//       res.json({ likes: post.likes.length,liked });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Failed to like post');
//     }
//   });
// router.get('/:id/liked', async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post) {
//             return res.status(404).send('Post not found');
//         }
//         const userId = req.user._id;
//         const liked = post.likes.includes(userId);
//         res.json({ liked });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Failed to check like status');
//     }
// });
// module.exports = router;

const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');

// GET: Fetch a single post and its comments
router.get('/:id', async (req, res) => {
  try {
    // Find the post by ID and populate author details
    const post = await Post.findById(req.params.id).populate('author');

    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Fetch comments related to the post
    const comments = await Comment.find({ post: req.params.id }).populate('author');

    // Render the post page with the post and comments data
    res.render('post', { post, comments });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST: Add a new comment to the post
router.post('/:id/comments', async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send('Comment cannot be empty');
    }

    // Create a new comment
    const newComment = new Comment({
      text: comment,
      post: req.params.id,
      author: req.user._id, // Assuming `req.user` contains the logged-in user's info
    });

    // Save the comment to the database
    await newComment.save();

    // Redirect back to the post page
    res.redirect(`/oneDream/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;