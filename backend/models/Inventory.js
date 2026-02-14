const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  spareName: String,
  stock: Number,
  purchaseCost: Number
}, { timestamps: true });

inventorySchema.index({ spareName: 1 });

module.exports = mongoose.model("Inventory", inventorySchema);
