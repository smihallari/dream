const Post = require('../models/post');
const User = require('../models/user');

const searchPosts = async (req, res) => {
  try {
    const { q: query, page = 1 } = req.query;
    const limit = 5; 
    const skip = (page - 1) * limit;

    if (!query || query.trim() === '') {
      return res.render('search', {
        posts: [],
        users: [],
        searchTerm: '',
        pagination: { totalPages: 0, currentPage: 1, prevPage: null, nextPage: null },
      });
    }

    const postResults = await Post.find({
      $or: [
        { title: new RegExp(query, 'i') },
        { content: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') },
      ],
    })
      .sort({ createdAt: -1 })
      .populate('author', 'username') 
      .limit(limit);

    const userResults = await User.find({
      $or: [
        { username: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') },
      ],
    })
      .sort({ username: 1 })
      .limit(limit);

    res.render('search', {
      posts: postResults,
      users: userResults,
      searchTerm: query,
    });
  } catch (err) {
    error.message = 'Error searching';
                error.status = 500;
                next(error);
  }
};

module.exports = { searchPosts };