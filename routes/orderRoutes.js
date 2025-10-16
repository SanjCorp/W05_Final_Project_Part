const express = require("express");
const { 
  getAllX,
  getXById,
  createX,
  updateX,
  deleteX 
} = require("../controllers/orderController");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

// Todas las rutas protegidas
router.get("/", ensureAuth, getAllX);
router.get("/:id", ensureAuth, getXById);
router.post("/", ensureAuth, createX);
router.put("/:id", ensureAuth, updateX);
router.delete("/:id", ensureAuth, deleteX);

module.exports = router;
