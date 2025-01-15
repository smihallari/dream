const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index',{ isLoggedIn: req.isLoggedIn, user: req.user });
});
router.use('/posts', require('./posts'));

module.exports = router;