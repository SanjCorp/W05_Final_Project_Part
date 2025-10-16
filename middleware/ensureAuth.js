// middleware/ensureAuth.js
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Usuario autenticado, continua
  }
  return res.status(401).json({ message: "❌ Necesitas iniciar sesión para acceder" });
};
