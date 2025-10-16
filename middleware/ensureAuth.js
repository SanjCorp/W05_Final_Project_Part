module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer secreto123") {
    return res.status(401).json({ message: "No autorizado" });
  }
  next();
};
