const Post = require('../models/post');
const Comment = require('../models/comment');

const addComment = async (req, res) => {
  try {
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
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
    console.error('Error adding comment:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllComments,
  addComment
};