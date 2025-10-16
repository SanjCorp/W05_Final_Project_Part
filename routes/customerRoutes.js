const express = require('express');
const Customer = require('../models/Customer');

module.exports = (ensureAuth) => {
  const router = express.Router();

  router.post('/', ensureAuth, async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const customer = new Customer({ name, email, phone });
      await customer.save();
      res.status(201).json(customer);
    } catch (err) {
      console.error('Error al crear cliente:', err);
      res.status(500).json({ message: 'Error al crear cliente' });
    }
  });

  router.get('/', ensureAuth, async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
  });

  return router;
};
