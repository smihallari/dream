
const authenticationWare = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user info to request object
    req.isLoggedIn = true;
  } else {
    req.isLoggedIn = false;
  }
  next();
};

module.exports = authenticationWare;
