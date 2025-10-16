// controllers/supplierController.js
const Supplier = require("../models/supplierModel");

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedores", error });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Proveedor no encontrado" });
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener proveedor", error });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: "Error al crear proveedor", error });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Proveedor no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar proveedor", error });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Proveedor no encontrado" });
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar proveedor", error });
  }
};
