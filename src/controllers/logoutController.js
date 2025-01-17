const logout = (req, res) => {

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.redirect('/',{isLoggedIn: false});
    });
  };
  
  module.exports = logout;