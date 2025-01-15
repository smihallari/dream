const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');
router.post('/', logoutController);
router.get('/', (req, res) => {
    res.render('index',{ isLoggedIn: req.isLoggedIn, user: req.user });
  });
module.exports = router;