const express = require('express');
const router = express.Router();

// Contest route handler
router.get('/', (req, res) => {
    res.render('contest', {
        isLoggedIn: req.isLoggedIn || false,
        user: req.user || null,
    });
});

module.exports = router;