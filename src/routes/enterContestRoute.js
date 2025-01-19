const express = require('express');
const router = express.Router();
const { enterContest } = require('../controllers/enterContestController'); // Import only the function
const multer = require('multer');
const Post = require('../models/post');

const upload = multer({ storage: multer.memoryStorage() });

// Route to render the contest entry form
router.get('/', (req, res) => {
  res.render('contestform', {
    isLoggedIn: req.isLoggedIn || false,
    username: req.user?.username || null,
  });
});

// Existing route for submitting the contest form
router.post('/enterContest', upload.single('image'), enterContest);

module.exports = router;
