const express = require('express');
const Product = require('../models/productModel'); // <- corregido

module.exports = (ensureAuth) => {
  const router = express.Router();

  router.get('/', ensureAuth, async (req, res) => {
    const products = await Product.find();
    res.json(products);
  });

  router.post('/', ensureAuth, async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  });

  router.put('/:id', ensureAuth, async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  });

  router.delete('/:id', ensureAuth, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  });

  return router;
};
