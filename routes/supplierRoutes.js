// routes/supplierRoutes.js
const express = require('express');
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');

const router = express.Router();

// Aquí aplicamos ensureAuth directamente en cada ruta
const ensureAuth = require('../middleware/ensureAuth');

router.get('/', ensureAuth, getAllSuppliers);
router.get('/:id', ensureAuth, getSupplierById);
router.post('/', ensureAuth, createSupplier);
router.put('/:id', ensureAuth, updateSupplier);
router.delete('/:id', ensureAuth, deleteSupplier);

module.exports = router;
ut("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;
