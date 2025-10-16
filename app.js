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
const ensureAuth = require("./middleware/ensureAuth");

const app = express();
app.use(express.json());

// 🟢 Configuración de sesión
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
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 🟢 Autenticación con Google
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
    res.redirect("/api-docs");
  }
);

app.get("/auth/failure", (req, res) =>
  res.status(401).send("❌ Error al iniciar sesión con Google.")
);

app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.get("/login", (req, res) => res.redirect("/auth/google"));

// 🧱 Middleware de protección aplicado dentro de las rutas
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/customers", customerRoutes);
app.use("/suppliers", supplierRoutes);

// 🧾 Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => res.redirect("/api-docs"));

app.use((req, res) => res.status(404).json({ message: "Not Found" }));

app.use((err, req, res, next) => {
  console.error("⚠️ Error detectado:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Error" });
});

// 🟢 Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`));
  })
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err.message));

module.exports = app;
