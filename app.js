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
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const ensureAuth = require("./middleware/ensureAuth");

const app = express();
app.use(express.json());

// Configuración de sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave_segura",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 días
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Autenticación con Google
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    console.log("🔐 Login exitoso con Google");
    // Redirige a Swagger para probar las rutas
    res.redirect("/api-docs");
  }
);

app.get("/auth/failure", (req, res) =>
  res.status(401).send("❌ Error al iniciar sesión con Google.")
);

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Sesión cerrada correctamente." });
    });
  });
});

app.get("/login", (req, res) => res.redirect("/auth/google"));

// Rutas protegidas con ensureAuth y prefijo /api
app.use("/api/products", ensureAuth, productRoutes);
app.use("/api/orders", ensureAuth, orderRoutes);
app.use("/api/customers", ensureAuth, customerRoutes);
app.use("/api/suppliers", ensureAuth, supplierRoutes);

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => res.redirect("/api-docs"));

// Middleware de debug (opcional, ver req.user)
app.use((req, res, next) => {
  console.log("REQ.USER:", req.user);
  next();
});

// Manejo de errores
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

app.use((err, req, res, next) => {
  console.error("⚠️ Error detectado:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Error" });
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`));
  })
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err.message));

module.exports = app;
