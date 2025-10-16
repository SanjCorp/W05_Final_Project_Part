// middleware/ensureAuth.js
module.exports = function ensureAuth(req, res, next) {
  // Si se usa desde navegador (Swagger/UI) redirigimos a /login,
  // si es llamada API (Accept: application/json) devolvemos 401 JSON.
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Si la petición espera JSON devolvemos 401 (API clients / fetch / curl)
  const accept = req.get("Accept") || "";
  if (accept.includes("application/json") || req.xhr) {
    return res.status(401).json({ message: "❌ No autorizado. Inicia sesión con Google." });
  }

  // En caso de navegador redirigir a login
  return res.redirect("/login");
};
