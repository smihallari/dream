const express = require('express');
const router = express.Router();
const Post = require('../models/post'); 
const authentication = require('../middleware/authenticationWare');
const Comment = require('../models/comment');
const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            const error = new Error('Post not found');
            error.status = 404; 
            return next(error);
        }
        const comment = new Comment({
            content: req.body.content,
            author: req.user._id,
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

router.post('/:id/comment',authentication, addComment);

module.exports = router;