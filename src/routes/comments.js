const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authenticationWare');
const CmntController= require('../controllers/commentController');

router.post('/:id/comment',authentication, CmntController.addComment);
router.post('/:postId/:commentId/deletecomment', authentication, CmntController.deleteComment);
module.exports = router;