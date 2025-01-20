const express = require('express');
const router = express.Router();
const { enterContest } = require('../controllers/enterContestController'); 
const multer = require('multer');
const Post = require('../models/post');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
  res.render('contestform', { 
    isLoggedIn: req.isLoggedIn || false,
    username: req.user?.username || null,
  });
});

router.post('/enterContest', upload.single('image'), enterContest);

module.exports = router;
