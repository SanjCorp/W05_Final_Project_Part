// controllers/supplierController.js
const Supplier = require("../models/supplierModel");

exports.getAllSuppliers = async (req, res) => {
  try {
    const list = await Supplier.find();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const s = await Supplier.findById(req.params.id);
    if (!s) return res.status(404).json({ message: "Supplier not found" });
    res.json(s);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const newS = new Supplier(req.body);
    const saved = await newS.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Supplier not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
