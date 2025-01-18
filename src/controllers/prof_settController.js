const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Render the profile settings page
const getProfileSettings = async (req, res) => {
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
};

// Handle profile settings update
const updateProfileSettings = async (req, res) => {
  try {
    const { username } = req.params;
    const { 
      newName, newSurname, newUsername, newEmail, newPassword, newBio, 
      newTwitter, newFacebook, NewInstagram 
    } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const updateFields = {
      name: newName || user.name,
      surname: newSurname || user.surname,
      username: newUsername || user.username,
      email: newEmail || user.email,
      password: user.password,
      bio: newBio || user.bio,
      twitter: newTwitter || user.twitter,
      facebook: newFacebook || user.facebook,
      instagram: NewInstagram || user.instagram,
    };

    if (newPassword && newPassword.trim() !== '') {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.password = hashedPassword;
    }

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

    const updatedUser = await User.findByIdAndUpdate(user._id, updateFields, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    req.session.user = updatedUser;
    res.redirect(`/profile/${updatedUser.username}`);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).render('profile_settings', {
      user: req.body,
      isLoggedIn: req.isLoggedIn,
      errorMessage: error.message || 'Failed to update profile settings.',
    });
  }
};
 
module.exports = { getProfileSettings, updateProfileSettings };