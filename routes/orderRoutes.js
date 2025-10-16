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
router.get("/", ensureAuth, getAllorder);
router.get("/:id", ensureAuth, getorderById);
router.post("/", ensureAuth, createorder);
router.put("/:id", ensureAuth, updateorder);
router.delete("/:id", ensureAuth, deleteorder);

module.exports = router;
