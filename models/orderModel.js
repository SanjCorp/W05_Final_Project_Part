const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("Order", orderSchema);
