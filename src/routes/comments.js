const express = require('express');
const router = express.Router();
const { getAllComments, addComment } = require('../controllers/commentController');
const authentication = require('../middleware/authenticationWare');

// Route to get all comments for a post (no authentication required)
router.get('/posts/:id/comments', getAllComments);

// Route to post a comment on a post (authentication required)
router.post('/posts/:id/comment', authentication, addComment);

module.exports = router;