const logout = (req, res) => {
    // Destroy the session
    console.log('logout');
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      // Redirect to the homepage or login page after logout
      res.redirect('/');
    });
  };
  
  module.exports = logout;