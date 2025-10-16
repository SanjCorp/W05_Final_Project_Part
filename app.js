const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
dotenv.config();
require("./auth");

const swaggerDocument = require("./swagger/swagger.json");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const ensureAuth = require("./middleware/ensureAuth");

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave_segura",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => res.redirect("/api-docs")
);
app.get("/auth/failure", (req, res) => res.status(401).send("❌ Error al iniciar sesión con Google."));
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

app.use("/api/products", ensureAuth, productRoutes);
app.use("/api/orders", ensureAuth, orderRoutes);
app.use("/api/customers", ensureAuth, customerRoutes);
app.use("/api/suppliers", ensureAuth, supplierRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => res.redirect("/api-docs"));

app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Error" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));

module.exports = app;
