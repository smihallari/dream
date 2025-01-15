const Post = require('../models/post');
const multer = require('multer');
const sharp = require('sharp');
const express = require('express');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageBuffer = null;

    if (req.file) {
      imageBuffer = await sharp(req.file.buffer)
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    const newPost = new Post({
      title,
      content,
      image: imageBuffer,
      user: req.user._id
    });

    await newPost.save();
    // we omit the image to not send a large data to the client.
    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        user: newPost.user
      }
    });
    
  } catch (error) {
    res.status(500).send(error.message);
  }
};


router.post('/create', upload.single('image'), createPost);

module.exports = router;