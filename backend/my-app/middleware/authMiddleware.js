// Example using Passport session auth
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: Please log in.' });
};

module.exports = { ensureAuthenticated }; 