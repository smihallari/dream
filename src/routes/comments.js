const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Assuming you have a Post model
const authentication = require('../middleware/authenticationWare');
const Comment = require('../models/comment');
const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        const comment = new Comment({
            content: req.body.content,
            author: req.user._id,
            post: req.params.id
        });
        await comment.save();
        post.comments.push(comment);
        await post.save();
        res.json({ success: true, comment });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add comment');
    }
};

router.post('/:id/comment', authentication, addComment);

module.exports = router;