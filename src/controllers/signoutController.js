const logout = (req, res) => {

  req.session.destroy((error) => {
    if (error) {
      const error = new Error('failed to logout');
      error.status = 500; 
      return next(error);
    }
    
  });
};
module.exports = logout;