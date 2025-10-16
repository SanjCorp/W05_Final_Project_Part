const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const path = require("path");

dotenv.config();
require("./auth");

const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const ensureAuth = require("./middleware/ensureAuth");
const swaggerDocument = require("./swagger/swagger.json");

const app = express();
app.use(express.json());

// Session
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

// OAuth Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect("/api-docs");
  }
);

app.get("/auth/failure", (req, res) => res.status(401).send("❌ Error logging in with Google"));

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Session closed successfully." });
    });
  });
});

app.get("/login", (req, res) => res.redirect("/auth/google"));

// Protected routes
app.use("/api/customers", ensureAuth, customerRoutes);
app.use("/api/orders", ensureAuth, orderRoutes);
app.use("/api/products", ensureAuth, productRoutes);
app.use("/api/suppliers", ensureAuth, supplierRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => res.redirect("/api-docs"));

// Errors
app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Error" });
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

module.exports = app;
