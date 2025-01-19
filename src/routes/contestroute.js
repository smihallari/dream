const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { route } = require('./posts');

router.get('/', async(req,res) =>{
    const posts = await Post.find({isInContest : true })
    .populate('author', 'name')
    .select('title category author')
    .lean();

    res.render('contest', {isLoggedIn: req.isLoggedIn, user: req.user,posts});
    });
    router.use('/posts', require('./posts'));
    
    module.exports = router;

