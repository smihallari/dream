const Post = require('../models/post');
const sharp = require('sharp');
const axios = require('axios');

const createPost = async (req, res) => {
  try {
    const { title, category,content, imageUrl } = req.body;
    const author = req.user.id;
    let imageBuffer = null;

    if (req.file) {
      // Handle uploaded file
      imageBuffer = await sharp(req.file.buffer)
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toBuffer();
    } else if (imageUrl) {
      // Handle image from URL
      try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        imageBuffer = await sharp(response.data)
          .resize(300, 300)
          .jpeg({ quality: 80 })
          .toBuffer();
      } catch (err) {
        console.error('Failed to download image from URL:', err.message);
        return res.status(400).json({ error: 'Invalid image URL' });
      }
    }

    const newPost = new Post({
      author,
      title,
      category,
      content,
      image: imageBuffer,
      
    });

    await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: newPost._id,
        author: newPost.author,
        title: newPost.title,
        content: newPost.content,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Failed to create post');
  }
};

module.exports = { createPost };
