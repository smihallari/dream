const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    try{
      res.render('about',{ 
        isLoggedIn: req.isLoggedIn || false,
        user: req.user || null,
          });
    }catch(error){
        console.error(error);
        res.status(500).send('Failed to load about page');
    }
});
module.exports = router;