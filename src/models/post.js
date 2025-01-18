const mongoose = require('mongoose');
const express = require('express');
// const { getFilteredPosts } = require('../controllers/getallPostscontr');
const router = express.Router();

const PostSchema = new mongoose.Schema({
    author: 
        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: 
        { type: String, required: true, unique: true },
    content: 
        { type: String, required: true },
    date: 
        { type: Date, default: Date.now },
    category: 
        { type: String, required: true },
    // likes: 
    //     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',  timestamp: { type: Date, default: Date.now } }],
    likes: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    image: 
        { type: Buffer },
    commentsAllowed:{
        type: Boolean,default: true
    },

    

}, { timestamps: true });

// PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ title: 'text', content: 'text', category: 1 });


const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

// router.get('/filter', getFilteredPosts);
// module.exports = router;
