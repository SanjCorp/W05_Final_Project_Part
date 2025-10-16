const express = require("express");
const { 
  getAllX,
  getXById,
  createX,
  updateX,
  deleteX 
} = require("../controllers/customerController");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

// Todas las rutas protegidas
router.get("/", ensureAuth, getAllcustomer);
router.get("/:id", ensureAuth, getcustomerById);
router.post("/", ensureAuth, createcustomer);
router.put("/:id", ensureAuth, updatecustomer);
router.delete("/:id", ensureAuth, deletecustomer);

module.exports = router;
