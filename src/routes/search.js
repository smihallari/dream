const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Search handler
router.get('/', async (req, res) => {
  try {
    const query = req.query.query || '';
    if (!query.trim()) {
      return res.render('search', { posts: [], query: '', message: 'Enter a search term.' });
    }

    const posts = await Post.find({ $text: { $search: query } })
      .populate('author', 'name')
      .lean();

    res.render('search', { posts, query, message: null });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: { message: 'Internal Server Error' } });
  }
});

module.exports = router;
