// routes/supplierRoutes.js
const express = require("express");
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

// Todas las rutas protegidas con ensureAuth
router.get("/", ensureAuth, getAllSuppliers);
router.get("/:id", ensureAuth, getSupplierById);
router.post("/", ensureAuth, createSupplier);
router.put("/:id", ensureAuth, updateSupplier);
router.delete("/:id", ensureAuth, deleteSupplier);

module.exports = router;
