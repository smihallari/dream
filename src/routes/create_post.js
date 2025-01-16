const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/makePost'); // Import only the function
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
  res.render('create_post', { isLoggedIn: req.isLoggedIn, username: req.user.username });
});

router.post('/create', upload.single('image'), createPost);
module.exports = router;