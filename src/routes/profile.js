const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const Post = require('../models/post');
// const { isAuthenticated, hasRole } = require('../middleware/authenticationWare');

router.get('/:username', async (req, res,next) => {
  try {
    const profileUser = await User.findOne({ username: req.params.username }); 
    if(!profileUser){
      const error = new Error('User not found');
      error.status = 404; 
      return next(error);
    }
    let allowedtoEdit = false;
    const user = req.user;

    // ||profileUser.id === req.user._id
    
    if(user &&(profileUser.id === req.user.id ||req.user.role === 'admin')){
      allowedtoEdit = true;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 2;
    const skip = (page-1)*limit;
    
    const totalPosts = await Post.countDocuments({ author: profileUser._id });
    const posts = await Post.find({ author: profileUser._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name')
      .select('title content image')
      .lean();

    const totalPages = Math.ceil(totalPosts / limit);

    res.render('profile', {
      profileUser,
      user,
      isLoggedIn: req.isLoggedIn,
      posts,
      allowedtoEdit,
      currentPage: page,
      totalPages
    });

    // const posts = await Post.find({ author: profileUser._id }) 
    //   .sort({ createdAt: -1 })
    //   .limit(3)
    //   .populate('author', 'name') 
    //   .select('title content image ') 
    //   .lean();
    // res.render('profile', { profileUser,user, isLoggedIn: req.isLoggedIn,posts,allowedtoEdit });
    
  } catch (error) {
    error.message = 'Failed to load profile';
    error.status = 500;
    next(error);
  }
});
router.get('/:username/makeadmin', async (req, res) => {
  const profileUser = await User.findOne({ username: req.params.username }); 
  if (!profileUser) {
    const error = new Error('User not found');
      error.status = 404; 
      return next(error);
  }
  profileUser.role = 'admin';
  const updatedUser = await User.findByIdAndUpdate(profileUser._id, updateFields, {
    runValidators: true,
    new: true,
  });
});

module.exports = router;