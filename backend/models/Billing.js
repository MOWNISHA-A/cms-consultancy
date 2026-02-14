const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  totalAmount: Number,
  paidAmount: Number,
  emiDueDate: Date,
  paymentStatus: {
    type: String,
    enum: ["Paid", "Partial", "Pending"],
    default: "Pending"
  }
}, { timestamps: true });

billingSchema.index({ emiDueDate: 1 });

module.exports = mongoose.model("Billing", billingSchema);
