const User = require('../models/user');
const Post = require('../models/post');

exports.getUserProfile = async (req, res, next) => {
  try {
    const profileUser = await User.findOne({ username: req.params.username });
    if (!profileUser) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    let allowedtoEdit = false;
    const user = req.user;

    if (
      user &&
      (profileUser.id === req.user.id ||
        profileUser.id === req.user._id ||
        req.user.role === 'admin')
    ) {
      allowedtoEdit = true;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 2;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ author: profileUser._id });
    const posts = await Post.find({ author: profileUser._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name')
      .select('title content image')
      .lean();

    const totalPages = Math.ceil(totalPosts / limit);

    res.render('profile', {
      profileUser,
      user,
      isLoggedIn: req.isLoggedIn,
      posts,
      allowedtoEdit,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    error.message = 'Failed to load profile';
    error.status = 500;
    next(error);
  }
};

exports.makeAdmin = async (req, res, next) => {
  try {
    const profileUser = await User.findOne({ username: req.params.username });
    if (!profileUser) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    profileUser.role = 'admin';
    const updatedUser = await User.findByIdAndUpdate(
      profileUser._id,
      { role: 'admin' },
      { runValidators: true, new: true }
    );

    res.redirect(`/users/${updatedUser.username}`);
  } catch (error) {
    error.message = 'Failed to make user admin';
    error.status = 500;
    next(error);
  }
};
