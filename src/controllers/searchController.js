const Post = require('../models/post');
const mongoose = require('mongoose');


const searchPosts = async (req, res) => {
  try {
    
    const { query, page = Math.max(1, parseInt(req.query.page, 10) || 1) } = req.query; 
    const limit = 10; 
    const skip = (page - 1) * limit; 

    if (!query) {
      return res.render('search', { posts: [], message: 'Please enter a search term.', query, currentPage: 1, totalPages: 0 });
    }

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails'
        }
      },
      {
        $unwind: '$authorDetails'
      },
      {
        $match: {
          $or: [
            { 'authorDetails.name': { $regex: query, $options: 'i' } },
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          title: 1,
          category: 1,
          content: 1,
          date: 1,
          'authorDetails.name': 1
        }
      }
    ]);

    const totalResults = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails'
        }
      },
      {
        $unwind: '$authorDetails'
      },
      {
        $match: {
          $or: [
            { 'authorDetails.name': { $regex: query, $options: 'i' } },
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $count: 'total'
      }
    ]);

    const totalPages = Math.ceil((totalResults[0] ? totalResults[0].total : 0) / limit);

    res.render('search', { posts, query, currentPage: page, totalPages });
  } catch (err) {
    console.error('Error searching posts:', err);
    res.status(500).send('Server error');
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const { query } = req.query; // extract search query from request

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = await Post.find({
      $text: { $search: query }, // Search title and content
    })
      .sort({ createdAt: -1 }); // Sort by newest first
      // .limit(10); // Limit to 10 results

    if (results.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'An error occurred while searching', error });
  }
};

module.exports = { searchPosts };