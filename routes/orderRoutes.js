// routes/orderRoutes.js
const express = require("express");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

// Todas las rutas protegidas
router.get("/", ensureAuth, getAllOrders);
router.get("/:id", ensureAuth, getOrderById);
router.post("/", ensureAuth, createOrder);
router.put("/:id", ensureAuth, updateOrder);
router.delete("/:id", ensureAuth, deleteOrder);

module.exports = router;
