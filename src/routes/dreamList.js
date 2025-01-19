// const express = require('express');
// const router = express.Router();
// const Post = require('../models/post');

// router.get('/', async (req, res) => {
//   const posts = await Post.find()
//   .populate('author', 'username image') 
//   .select('title category author image') 
//   .lean();
  
//   res.render('dreamList',{ isLoggedIn: req.isLoggedIn, user: req.user,posts });
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1; // Current page (default: 1)
    const limit = 10; // Posts per page
    const skip = (currentPage - 1) * limit;
    const goat = true;

    const filter = req.query.filter || 'newest';

    const filters = {};
    if (req.query.filter === 'newest') {
      filters.sort = { createdAt: -1 }; // Newest dreams
    } else if (req.query.filter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filters.createdAt = { $gte: oneWeekAgo }; // Dreams from the last week
    } else if (req.query.filter === 'alltime') {
      filters.sort = { popularity: -1 }; // All time popular dreams
    } else if (req.query.filter === 'winners') {
      filters.isWinner = true; // Contest winners
    }

    if (req.query.category) {
      filters.category = req.query.category; // Filter by category
    }

    const posts = await Post.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(filters.sort || { createdAt: -1 }) // Default sort by newest
      .lean();

    const totalPosts = await Post.countDocuments(filters);
    const totalPages = Math.ceil(totalPosts / limit);

    const pagination = {
      currentPage,
      totalPages,
      prev: currentPage > 1 ? `/dreamList?page=${currentPage - 1}&filter=${req.query.filter || ''}&category=${req.query.category || ''}` : null,
      next: currentPage < totalPages ? `/dreamList?page=${currentPage + 1}&filter=${req.query.filter || ''}&category=${req.query.category || ''}` : null,
    };

    res.render('dreamList', {
      appliedFilter: req.query.filter || req.query.category || 'All Posts',
      pagination,
      posts,
      goat
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.render('dreamList', {
      appliedFilter: 'Error',
      pagination: { currentPage: 1, totalPages: 0, prev: null, next: null },
      posts: [],
    });
  }
});



// router.use('/posts', require('./posts'));
module.exports = router;