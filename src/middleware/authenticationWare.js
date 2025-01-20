
const authenticationWare = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user; 
    req.isLoggedIn = true;
  } else {
    req.isLoggedIn = false;
  }
  next();
};

module.exports = authenticationWare;

