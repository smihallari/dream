const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
router.get('/:id', async (req, res,next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404; 
      return next(error);
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    const comments = await Comment.find({ post: req.params.id }).populate('author');
    const index = post.likes.indexOf(userId);
    
    let liked = false;
    if (index === -1) {
      liked = true;
    } else {
      liked = false;
    }
    console.log(liked);
    res.render('post', { post, comments,liked });
  } catch (error) {
    error.message = 'Server error';
    error.status = 500;
    next(error);
  }
});
router.get('/:id/edit', async (req, res,next) => {
  try {
    const post = await Post.findById(req.params.id)
    .populate('author');

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404; 
      return next(error);
    }
    const userId = req.user._id;
    res.render('editdream', { post });
  } catch (error) {
    error.message = 'Server error';
    error.status = 500;
    next(error);
  }
});
router.post('/:id/delete',async (req, res, next) => {
  try {
    const { id } = req.params; 
    const userId = req.user._id; 

    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      return next(error);
    }


    // Delete the post and associated comments
    await Comment.deleteMany({ post: post._id }); // Delete comments linked to the post
    await Post.findByIdAndDelete(id); // Delete the post itself

    // Redirect or respond with a success message
    res.redirect('/dreamList');
  } catch (error) {
    console.error(error.stack);
    error.message = 'Failed to delete post';
    error.status = 500;
    next(error);
  }
});
router.post('/:id/edit', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { newTitle, newContent, newCategory } = req.body;
    const userId = req.user._id;

    // Find the post by ID
    const post = await Post.findById(postId).populate('author');
    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      return next(error);
    }


    // Prepare updated fields
    const updatedFields = {
      title: newTitle || post.title,
      content: newContent || post.content,
      category: newCategory || post.category,
    };

    // Check for new image
    if (req.file) {
      updatedFields.image = await sharp(req.file.buffer)
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toBuffer();
    } else if (req.body.imageUrl && req.body.imageUrl !== post.imageUrl) {
      try {
        const response = await axios.get(req.body.imageUrl, { responseType: 'arraybuffer' });
        updatedFields.image = await sharp(response.data)
          .resize(300, 300)
          .jpeg({ quality: 80 })
          .toBuffer();
      } catch (error) {
        error.message = 'Invalid image URL';
        error.status = 400;
        return next(error);
      }
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(postId, updatedFields, { new: true });

    res.redirect(`/post/${updatedPost._id}`);
  } catch (error) {
    console.error(error.stack);
    error.message = 'Failed to update post';
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
    const post = await Post.findById(req.params.id).populate('author');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    const userId = req.user.id;
    const index = post.likes.indexOf(userId);
    
    let liked;
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
router.post('/:id/favorite', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    const userId = req.user._id; // Ensure `req.user` is populated by your authentication middleware


    // Find the user by ID
    const user = await User.findById(userId);
    const index = user.favorites.indexOf(post.id);
    let liked = false;
    if (index === -1) {
     
      liked = true;
    } else {
      liked = false;
    }
    let favorited = false;
    if (index === -1) {
      user.favorites.push(post.id);
      favorited = true;
    } else {
      user.favorites.splice(index, 1);
      favorited = false;
    }
    const comments = await Comment.find({ post: req.params.id }).populate('author');
    await user.save();
    res.render('post', { post, comments, liked,favorited });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to like post');
  }
});

module.exports = router;