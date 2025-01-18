
const authenticationWare = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user info to request object
    req.isLoggedIn = true;
  } else {
    req.isLoggedIn = false;
  }
  next();
};

// exports.isAuthenticated = (req, res, next) => {
//   if (!req.session.user) {
//     return res.status(401).send('Unauthorized');
//   }
//   next();
// };

// exports.hasRole = (role) => (req, res, next) => {
//   if (!req.session.user || req.session.user.role !== role) {
//     return res.status(403).send('Forbidden');
//   }
//   next();
// };

module.exports = authenticationWare;

