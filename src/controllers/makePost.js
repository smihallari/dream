const Post = require('../models/post');
const sharp = require('sharp');
const axios = require('axios');

const createPost = async (req, res,next) => {
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
      } catch (error) {
        error.message = 'invalid image url';
                error.status = 500;
                next(error);
      }
    }
    const commentsAllowedBool = commentsAllowed === 'on';
    const newPost = new Post({
      author,
      title,
      category,
      content,
      image: imageBuffer,
      commentsAllowedBool
      
    });
    await newPost.save();
    res.redirect('/dreamList');
  } catch (error) {
    console.log(error.stack);

    error.message = 'Failed to create post';
    error.status = 500;
    next(error);
  }
};

module.exports = { createPost };
