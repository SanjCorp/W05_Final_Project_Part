// controllers/supplierController.js
const Supplier = require("../models/supplierModel");

// Obtener todos los proveedores
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener un proveedor por ID
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un nuevo proveedor
const createSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newSupplier = new Supplier({ name, email, phone });
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar un proveedor
const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json(updatedSupplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar un proveedor
const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
