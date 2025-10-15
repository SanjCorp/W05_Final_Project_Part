const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String
});

module.exports = mongoose.model('Supplier', supplierSchema);
