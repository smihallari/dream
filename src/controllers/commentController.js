const Post = require('../models/post');
const Comment = require('../models/comment');

// Get all comments for a post (no authentication required)
const getAllComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post.comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).send('Server error');
  }
};

// Post a comment on a post (authentication required)
const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = new Comment({
      content: comment,
      author: req.user._id,
      post: req.params.id
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res.json({ message: 'Comment added', comment: newComment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllComments,
  addComment
};