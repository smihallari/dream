const express = require('express');
const router = express.Router();
const signinController = require('../controllers/signinController');
// router.get('/', (req, res) => {
//   res.render('signin');
// });
// router.post('/signin',signinController);
router.post('/', signinController);
router.get('/', (req, res) => res.render('signin'));

module.exports = router;