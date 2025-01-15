const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
router.get('/', (req, res) => {
  res.render('signup');
});
router.post('/auth/signup', signupController);
router.post('/auth/login',loginController);
module.exports = router;