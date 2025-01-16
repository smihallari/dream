const Post = require('../models/post');
const mongoose = require('mongoose');

const searchPosts = async (req, res) => {
  try {
    const { query, page = 1 } = req.query; 
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

module.exports = { searchPosts };