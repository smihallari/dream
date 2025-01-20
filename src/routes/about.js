const express = require('express');
const router = express.Router();
router.get('/', async (req, res,next) => {
    try{
      res.render('about',{ 
        isLoggedIn: req.isLoggedIn || false,
        user: req.user || null,
          });
    }catch(error){
      error.message = 'Failed to load about page';
      error.status = 500;
      next(error);
    }
});
module.exports = router;