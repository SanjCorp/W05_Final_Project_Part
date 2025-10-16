// app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const path = require("path");

dotenv.config();
require("./auth"); // Configuración de Google OAuth

// Importar rutas y Swagger
const swaggerDocument = require("./swagger/swagger.json");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

const app = express();
app.use(express.json());

// 🟢 Configuración de sesión (usando MongoStore)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave_segura",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 días
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 🟢 Rutas de autenticación con Google
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // 🔹 IMPORTANTE: este parámetro evita el error de "scope"
    prompt: "select_account", // opcional: fuerza selección de cuenta
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    console.log("🔐 Login exitoso con Google");
    res.redirect("/api-docs"); // redirige al Swagger
  }
);

app.get("/auth/failure", (req, res) => {
  res.status(401).send("❌ Error al iniciar sesión con Google.");
});

app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// 🔹 Ruta para iniciar sesión manualmente
app.get("/login", (req, res) => {
  res.redirect("/auth/google");
});

// 🧱 Middleware para proteger rutas
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res
    .status(401)
    .json({ message: "Unauthorized: please log in with Google first." });
}

// 🟢 Rutas protegidas
app.use("/products", productRoutes(ensureAuth));
app.use("/orders", orderRoutes(ensureAuth));
app.use("/customers", customerRoutes(ensureAuth));
app.use("/suppliers", supplierRoutes(ensureAuth));

// 🧾 Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 🔹 Página principal
app.get("/", (req, res) => res.redirect("/api-docs"));

// 🚫 Error 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// 🔴 Manejo global de errores
app.use((err, req, res, next) => {
  console.error("⚠️ Error detectado:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// 🟢 Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`)
    );
  })
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err.message));

module.exports = app;
