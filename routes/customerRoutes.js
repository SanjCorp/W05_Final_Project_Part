const express = require("express");
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();
const ensureAuth = require("../middleware/ensureAuth");

router.get("/", ensureAuth, getCustomers);
router.get("/:id", ensureAuth, getCustomerById);
router.post("/", ensureAuth, createCustomer);
router.put("/:id", ensureAuth, updateCustomer);
router.delete("/:id", ensureAuth, deleteCustomer);

module.exports = router;
