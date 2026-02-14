const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  deviceType: String,
  issue: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  estimatedCost: Number,
  actualCost: Number
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
