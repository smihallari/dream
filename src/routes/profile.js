const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const Post = require('../models/post');
// const { isAuthenticated, hasRole } = require('../middleware/authenticationWare');

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }); 

    if (!user) {
      return res.status(404).send('User not found');
    }
    const posts = await Post.find({ author: user._id }) 
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('author', 'name') 
      .select('title content image ') 
      .lean();
    res.render('profile', { user, isLoggedIn: req.isLoggedIn,posts });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load profile');
  }
});

// AUTH
// router.get('/', isAuthenticated, (req, res) => {
//   res.render('profile', { user: req.session.user });
// });

// router.get('/admin', hasRole('admin'), (req, res) => {
//   res.send('Admin Access Granted');
// });

// COOKIE
// Set Cookie
// router.get('/set-cookie', (req, res) => {
//   res.cookie('theme', 'dark', { httpOnly: true, maxAge: 3600000 });
//   res.send('Cookie set');
// });

// Read Cookie
// router.get('/read-cookie', (req, res) => {
//   const theme = req.cookies.theme;
//   res.send(`Theme: ${theme}`);
// });

// Clear Cookie
// router.get('/clear-cookie', (req, res) => {
//   res.clearCookie('theme');
//   res.send('Cookie cleared');
// });


module.exports = router;