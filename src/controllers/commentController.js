const express = require('express');
const router = express.Router();
const Post = require('../models/post'); 
const Comment = require('../models/comment');
const addComment = async (req, res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            const error = new Error('Post not found');
            error.status = 404; 
            return next(error);
        }
        const ath= req.user.id || req.user._id;
        const comment = new Comment({
            content: req.body.content,
            author: ath,
            post: req.params.id
        });
        await comment.save();
        post.comments.push(comment);
        await post.save();
        
        res.redirect('/post/'+post.id);
    } catch (error) {
        error.message = 'Failed to add comment';
        error.status = 500;
        next(error);
    }
};
const deleteComment = async (req, res, next) => {
    try {
      const { postId, commentId } = req.params; 
      const post = await Post.findById(postId).populate('author');
      if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        return next(error);
      }
      console.log(post);

      await Comment.findByIdAndDelete(commentId);
  
      post.comments = post.comments.filter(c => c.toString() !== commentId);
      await post.save();
  
      res.redirect('/post/' + postId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      error.message = 'Failed to delete comment';
      error.status = 500;
      next(error);
    }
  };
module.exports = {
  deleteComment,
  addComment
};