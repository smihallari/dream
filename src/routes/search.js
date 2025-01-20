const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController'); // Ensure this path is correct

router.get('/', searchController.searchPosts);

module.exports = router;