const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

// Todas las rutas protegidas
router.get("/", ensureAuth, getAllProducts);
router.get("/:id", ensureAuth, getProductById);
router.post("/", ensureAuth, createProduct);
router.put("/:id", ensureAuth, updateProduct);
router.delete("/:id", ensureAuth, deleteProduct);

module.exports = router;
