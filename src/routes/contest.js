const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1; 
    const limit = 5; 
    const skip = (currentPage - 1) * limit;
    const goat = false;

    const filter = req.query.filter || 'competitors';
    let appliedFilter = 'Current Competitors';

    const filters = {};
    let sort = { createdAt: -1 };

    if (filter === 'competitors') {
      filters.isWinner = false; 
      appliedFilter = 'Current Competitors';
    } else if (filter === 'newestWinners') {
      filters.isWinner = true; 
      sort = { createdAt: -1 };
      appliedFilter = 'Newest Winners';
    } else if (filter === 'popularWinners') {
      filters.isWinner = true; 
      sort = { popularity: -1 };
      appliedFilter = 'Popular Winners';
    } else if (filter === 'halloffame') {
      filters.isWinner = true; 
      filters.accolades = { $exists: true, $ne: null }; 
      appliedFilter = 'Hall of Fame';
    }

    if (req.query.category) {
      filters.category = req.query.category; 
      appliedFilter = `Category: ${req.query.category}`;
    }

    const posts = await Post.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate('author', 'username') 
      .lean();

    const totalPosts = await Post.countDocuments(filters);
    const totalPages = Math.ceil(totalPosts / limit);

    const pagination = {
      currentPage,
      totalPages,
      prev: currentPage > 1 ? `/contest?page=${currentPage - 1}&filter=${filter}&category=${req.query.category || ''}` : null,
      next: currentPage < totalPages ? `/contest?page=${currentPage + 1}&filter=${filter}&category=${req.query.category || ''}` : null,
    };

    res.render('contest', {
      appliedFilter,
      pagination,
      posts,
      goat
    });
  } catch (error) {
    console.error('Error fetching contest posts:', error);
    res.render('contest', {
      appliedFilter: 'Error',
      pagination: { currentPage: 1, totalPages: 0, prev: null, next: null },
      posts: [],
      goat: false
    });
  }
});

module.exports = router;