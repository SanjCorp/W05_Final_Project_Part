const express = require('express');
const Order = require('../models/orderModel'); // <- corregido

module.exports = (ensureAuth) => {
  const router = express.Router();

  router.get('/', ensureAuth, async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
  });

  router.post('/', ensureAuth, async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  });

  router.put('/:id', ensureAuth, async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  });

  router.delete('/:id', ensureAuth, async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  });

  return router;
};
