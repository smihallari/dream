const Post = require('../models/post');

// Search posts by title, content, and tags with pagination
const searchPosts = async (req, res) => {
  try {
    const { query, page = 1 } = req.query; // Get search query and page number (default: 1)
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit; // Calculate how many results to skip

    if (!query) {
      return res.render('search', { posts: [], message: 'Please enter a search term.', query, currentPage: 1, totalPages: 0 });
    }

    // Search in title, content, and tags (case insensitive)
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('comments')
      .skip(skip)
      .limit(limit)
      .lean();

    // Count total results for pagination
    const totalResults = await Post.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    });

    const totalPages = Math.ceil(totalResults / limit); // Calculate total pages

    if (posts.length === 0) {
      return res.render('search', { posts: [], message: 'No posts found for your search.', query, currentPage: page, totalPages });
    }

    res.render('search', { posts, message: null, query, currentPage: page, totalPages });
  } catch (err) {
    console.error('Error searching posts:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {searchPosts };
