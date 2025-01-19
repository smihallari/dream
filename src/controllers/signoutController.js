const logout = (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    
  });
};
module.exports = logout;