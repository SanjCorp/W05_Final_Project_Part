const express = require('express');
const Customer = require('../models/customerModel'); // <- corregido

module.exports = (ensureAuth) => {
  const router = express.Router();

  router.get('/', ensureAuth, async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
  });

  router.post('/', ensureAuth, async (req, res) => {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  });

  router.put('/:id', ensureAuth, async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(customer);
  });

  router.delete('/:id', ensureAuth, async (req, res) => {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  });

  return router;
};
