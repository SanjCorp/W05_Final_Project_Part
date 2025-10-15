// controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const moment = require('moment-timezone');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(400).json({ error: 'productId not found' });

    const price = req.body.price ? Number(req.body.price) : product.price;

    const newOrder = new Order({
      ...req.body,
      price,
      nameproduct: product.name,
      createdAt: moment().tz('America/Boise').toDate()
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: moment().tz('America/Boise').toDate() }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });

    updated.history.push({ action: 'updated', user: 'system', date: moment().tz('America/Boise').toDate() });
    await updated.save();

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
