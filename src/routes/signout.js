const express = require('express');
const router = express.Router();
const signoutController = require('../controllers/signoutController');
router.post('/', signoutController);
console.log("getting here");
router.get('/', (req, res) => {
    res.render('index',{  isLoggedIn: req.isLoggedIn, user: req.user, });
  });
module.exports = router;