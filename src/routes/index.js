
const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getTimeAgo(date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now - postDate) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  }
}

router.get('/', async (req, res) => {
  try {
    // Fetch recent dreams
    const recentDreams = await Post.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title createdAt image _id')
      .populate('author', 'username') 
      .lean();

    recentDreams.forEach(dream => {
      dream.timeAgo = getTimeAgo(dream.createdAt);
    });

    // Fetch posts for the carousel
    const posts = await Post.find()
      
      .select('title author date content image')
      .limit(3)
      .populate('author', 'username')
      .lean();

    // Aggregate posts by month and year for archives
    const archives = await Post.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }, // Sort by most recent
      { $limit: 10 } // Get the 10 most recent
    ]);

    // Map results to include month names
    const formattedArchives = archives.map(archive => ({
      year: archive._id.year,
      month: archive._id.month,
      monthName: monthNames[archive._id.month - 1]
    }));

    // Render the index templa te with all the data
    
    res.render('index', {
      recentDreams,
      posts,
      archives: formattedArchives,
      isLoggedIn: req.isLoggedIn || false,
      
      user: req.user || null,
    });
  } catch (error) {
    error.message = 'Error fetching data';
    error.status = 500;
    next(error);

    // Render with empty arrays in case of errors
    res.render('index', {
      recentDreams: [],
      posts: [],
      archives: [],
      isLoggedIn: req.isLoggedIn || false,
      user: req.user || null,
    });
  }
});

module.exports = router;