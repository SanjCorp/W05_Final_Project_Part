const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

dotenv.config();
require("./auth"); // Google OAuth

const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const ensureAuth = require("./middleware/ensureAuth");

const app = express();
app.use(express.json());

// Sesión
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

// Rutas protegidas
app.use("/customers", ensureAuth, customerRoutes);
app.use("/suppliers", ensureAuth, supplierRoutes);

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`));
  })
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err.message));

module.exports = app;
