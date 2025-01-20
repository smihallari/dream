const Post = require('../models/post');
const Comment = require('../models/comment');

const addComment = async (req, res) => {
  try {
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error('Post not found');
      error.status = 404; 
      return next(error);
    }
    console.log("\n\n"+req.user._id);
    const newComment = new Comment({
      content: req.body.content,
      author: req.user._id,
      post: req.params.id
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res.json({ message: 'Comment added', comment: newComment });
  } catch (err) {
    error.message = 'Error adding comment';
    error.status = 500;
    next(error);
  }
};

module.exports = {
  getAllComments,
  addComment
};