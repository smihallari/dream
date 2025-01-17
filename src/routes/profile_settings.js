const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// GET route to render the profile settings page
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('profile_settings', { user, isLoggedIn: req.isLoggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load profile settings');
  }
});

// PUT route to handle profile settings update
router.post('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { newName, newSurname, newUsername, newEmail, newPassword } = req.body;
    console.log(req.body);
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const pass = await bcrypt.hash(newPassword,10);
    // Prepare fields to update
    const updateFields = {
        name: newName || user.name,
        surname: newSurname || user.surname,
        username: newUsername || user.username,
        email: newEmail || user.email,
        password : pass || user.password
    };

    // Check for duplicate email or username
    if (updateFields.email !== user.email || updateFields.username !== user.username) {
      const duplicateUser = await User.findOne({
        $or: [
          ...(updateFields.email !== user.email ? [{ email: updateFields.email }] : []),
          ...(updateFields.username !== user.username ? [{ username: updateFields.username }] : []),
        ],
        _id: { $ne: user._id },
      });

      if (duplicateUser) {
        return res.status(400).render('profile_settings', {
          user: { ...user.toObject(), ...updateFields },
          isLoggedIn: req.isLoggedIn,
          errorMessage: 'Username or email is already taken.',
        });
      }
    }

   

    // Update user
    const updatedUser = await User.findByIdAndUpdate(user._id, updateFields, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    // Redirect to updated profile
    res.redirect(`/profile/${updatedUser.username}`);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).render('profile_settings', {
      user: req.body,
      isLoggedIn: req.isLoggedIn,
      errorMessage: error.message || 'Failed to update profile settings.',
    });
  }
});

module.exports = router;
