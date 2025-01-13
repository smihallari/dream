const express = require('express');
const router = express.Router();
const { getAllPosts, likePost, sortPosts } = require('../controllers/getallPostscontr');
const { searchPosts } = require('../controllers/searchController');
const authentication = require('../middleware/authenticationWare');

// Route to display all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.render('dreamList', { posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Server error');
  }
});

// Route to like a post
router.post('/posts/:id/like', authentication, async (req, res) => {
  try {
    await likePost(req, res);
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).send('Server error');
  }
});

// Route to sort posts
router.get('/posts/sort', async (req, res) => {
  try {
    const posts = await sortPosts(req.query.order);
    res.render('dreamList', { posts });
  } catch (err) {
    console.error('Error sorting posts:', err);
    res.status(500).send('Server error');
  }
});

// Route to search posts
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const posts = await searchPosts(query);
    res.render('dreamList', { posts });
  } catch (err) {
    console.error('Error searching posts:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;