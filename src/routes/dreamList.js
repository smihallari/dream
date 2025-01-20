
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

    const query = {};
    let sort = { createdAt: -1 }; // Default sorting for "Newest posts"

    if (filter === 'Newest posts') {
      sort = { createdAt: -1 }; 
    } else if (filter === 'Top this week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      query.createdAt = { $gte: oneWeekAgo }; 
      sort = { popularity: -1 }; // Assuming "popularity" exists in the schema
    } else if (filter === 'Top of all time') {
      // Top posts by likes, handled via aggregation below
      sort = null;
    } else if (filter === 'Contest winners') {
      query.isWinner = true; 
    }

    if (req.query.category) {
      query.category = req.query.category; 
    }

    let posts;
    let totalPosts;

    if (filter === 'Top of all time') {
      // Aggregation for sorting by likes.length
      const aggregationPipeline = [
        { $match: query },
        {
          $addFields: {
            likeCount: { $size: { $ifNull: ['$likes', []] } }, // Calculate likes length
          },
        },
        { $sort: { likeCount: -1 } }, // Sort by likeCount in descending order
        { $skip: skip }, // Skip for pagination
        { $limit: limit }, // Limit for pagination
      ];

      const countPipeline = [
        { $match: query },
      ];

      [posts, totalPosts] = await Promise.all([
        Post.aggregate(aggregationPipeline).exec(),
        Post.aggregate(countPipeline).count('total').exec().then(res => res[0]?.total || 0),
      ]);
    } else {
      // Standard query for other filters
      posts = await Post.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sort) // Apply sorting here
        .populate('author', 'username') 
        .lean();

      totalPosts = await Post.countDocuments(query);
    }

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