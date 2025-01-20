const Post = require('../models/post');
const sharp = require('sharp');
const axios = require('axios');

const createPost = async (req, res) => {
  try {
    
    const { title, category,content, imageUrl,commentsAllowed } = req.body;
    const author = req.user.id || req.user._id;
    
    
    let imageBuffer = null;
    if (req.file) {
      imageBuffer = await sharp(req.file.buffer)
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toBuffer();
    } else if (imageUrl) {
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
      commentsAllowed
      
    });
    
    await newPost.save();

    res.redirect('/dreamList');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Failed to create post');
  }
};

module.exports = { createPost };
