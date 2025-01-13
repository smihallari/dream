const mongoose = require('mongoose');

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
    tags: 
        { type: [String], required: true },
    likes: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    image: 
        { type: String, default: '' },
    

}, { timestamps: true });


const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
