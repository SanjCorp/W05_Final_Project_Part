// routes/customerRoutes.js
const express = require("express");
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

// Todas las rutas protegidas con ensureAuth
router.get("/", ensureAuth, getAllCustomers);
router.get("/:id", ensureAuth, getCustomerById);
router.post("/", ensureAuth, createCustomer);
router.put("/:id", ensureAuth, updateCustomer);
router.delete("/:id", ensureAuth, deleteCustomer);

module.exports = router;
