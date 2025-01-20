
const express = require('express');
const router = express.Router();
const Post = require('../models/post');



router.get('/', async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1; 
    const limit = 5; 
    const skip = (currentPage - 1) * limit;
    const goat = true;

    const filter = req.query.filter || 'Newest posts';

    const filters = {};
    if (req.query.filter === 'Newest posts') {
      filters.sort = { createdAt: -1 }; 
    } else if (req.query.filter === 'Top this week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filters.createdAt = { $gte: oneWeekAgo }; 
    } else if (req.query.filter === 'Top of all time') {
      filters.sort = { popularity: -1 }; 
    } else if (req.query.filter === 'Contest winners') {
      filters.isWinner = true; 
    }

    if (req.query.category) {
      filters.category = req.query.category; 
    }

    const posts = await Post.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(filters.sort || { createdAt: -1 })
      .populate('author', 'username') 
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

module.exports = router;