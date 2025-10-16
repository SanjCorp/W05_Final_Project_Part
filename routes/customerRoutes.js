// routes/customerRoutes.js
const express = require("express");
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

module.exports = (ensureAuth) => {
  const router = express.Router();

  // Todas las rutas requieren autenticación
  router.get("/", ensureAuth, async (req, res) => {
    try {
      const customers = await getCustomers(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/:id", ensureAuth, async (req, res) => {
    try {
      const customer = await getCustomerById(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/", ensureAuth, async (req, res) => {
    try {
      const newCustomer = await createCustomer(req, res);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put("/:id", ensureAuth, async (req, res) => {
    try {
      const updated = await updateCustomer(req, res);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete("/:id", ensureAuth, async (req, res) => {
    try {
      const deleted = await deleteCustomer(req, res);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
