const express = require('express');
const Supplier = require('../models/supplierModel'); // <- corregido

module.exports = (ensureAuth) => {
  const router = express.Router();

  router.get('/', ensureAuth, async (req, res) => {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  });

  router.post('/', ensureAuth, async (req, res) => {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  });

  router.put('/:id', ensureAuth, async (req, res) => {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(supplier);
  });

  router.delete('/:id', ensureAuth, async (req, res) => {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  });

  return router;
};
