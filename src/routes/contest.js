const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1; // Current page (default: 1)
    const limit = 10; // Posts per page
    const skip = (currentPage - 1) * limit;
    const goat = false;

    const filter = req.query.filter || 'competitors';
    let appliedFilter = 'Current Competitors';

    const filters = {};
    let sort = { createdAt: -1 }; // Default sort by newest

    if (filter === 'competitors') {
      filters.isWinner = false; // Current competitors
      appliedFilter = 'Current Competitors';
    } else if (filter === 'newestWinners') {
      filters.isWinner = true; // Newest winners
      sort = { createdAt: -1 };
      appliedFilter = 'Newest Winners';
    } else if (filter === 'popularWinners') {
      filters.isWinner = true; // Popular winners
      sort = { popularity: -1 };
      appliedFilter = 'Popular Winners';
    } else if (filter === 'halloffame') {
      filters.isWinner = true; // Hall of fame
      filters.accolades = { $exists: true, $ne: null }; // Winners with accolades
      appliedFilter = 'Hall of Fame';
    }

    if (req.query.category) {
      filters.category = req.query.category; // Filter by category
      appliedFilter = `Category: ${req.query.category}`;
    }

    const posts = await Post.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort)
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