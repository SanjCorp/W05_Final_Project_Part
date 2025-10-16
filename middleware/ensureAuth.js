// middleware/ensureAuth.js
module.exports = function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "❌ No autorizado, inicia sesión primero." });
};
