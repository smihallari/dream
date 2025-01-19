const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Render the profile settings page
const getProfileSettings = async (req, res) => {
  try {

    const profileUser = await User.findOne({ username: req.params.username });
    const user = req.user;
    if (!profileUser) {
      return res.status(404).send('User not found');
    }
    res.render('profile_settings', {  profileUser,user, isLoggedIn: req.isLoggedIn });
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
      newTwitter, newFacebook, newInstagram 
    } = req.body;

    const profileUser = await User.findOne({ username });
    if (!profileUser) {
      return res.status(404).send('User not found');
    }

    const updateFields = {
      name: newName || profileUser.name,
      surname: newSurname || profileUser.surname,
      username: newUsername || profileUser.username,
      email: newEmail || profileUser.email,
      bio: newBio || profileUser.bio,
      twitter: newTwitter || profileUser.twitter,
      facebook: newFacebook || profileUser.facebook,
      instagram: newInstagram || profileUser.instagram,
    };

    if (newPassword && newPassword.trim() !== '') {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.password = hashedPassword;
    }

    if (updateFields.email !== profileUser.email || updateFields.username !== profileUser.username) {
      const duplicateUser = await User.findOne({
        $or: [
          ...(updateFields.email !== profileUser.email ? [{ email: updateFields.email }] : []),
          ...(updateFields.username !== profileUser.username ? [{ username: updateFields.username }] : []),
        ],
        _id: { $ne: profileUser._id },
      });

      if (duplicateUser) {
        return res.status(400).render('profile_settings', {
          profileUser: { ...profileUser.toObject(), ...updateFields },
          isLoggedIn: req.isLoggedIn,
          errorMessage: 'Username or email is already taken.',
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(profileUser._id, updateFields, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    
    if (req.user.role !== 'admin' || req.user.id === profileUser.id) {
      req.session.user = updatedUser;
    }
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