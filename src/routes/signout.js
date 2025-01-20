const express = require('express');
const router = express.Router();
const signoutController = require('../controllers/signoutController');


router.post('/', async (req, res, next) => {
  try {
    await signoutController(req, res);
    res.redirect('/');
  } catch (error) {
    next(error); 
  }
});
module.exports = router;