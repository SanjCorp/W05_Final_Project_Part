// middleware/ensureAuth.js
module.exports = function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // Usuario autenticado
  }
  res.status(401).json({ message: "❌ Debes iniciar sesión para acceder." });
};
