const Billing = require("../models/Billing");

// Create a new billing record
exports.createBilling = async (req, res, next) => {
  try {
    const { service, totalAmount, paidAmount, emiDueDate } = req.body;

    let paymentStatus = "Pending";
    if (paidAmount >= totalAmount) {
      paymentStatus = "Paid";
    } else if (paidAmount > 0) {
      paymentStatus = "Partial";
    }

    const billing = await Billing.create({
      service,
      totalAmount,
      paidAmount: paidAmount || 0,
      emiDueDate,
      paymentStatus
    });

    await billing.populate("service");

    res.status(201).json({
      success: true,
      data: billing
    });
  } catch (error) {
    next(error);
  }
};

// Get all billing records
exports.getAllBilling = async (req, res, next) => {
  try {
    const { paymentStatus } = req.query;
    const filter = paymentStatus ? { paymentStatus } : {};

    const billings = await Billing.find(filter)
      .populate({
        path: "service",
        populate: { path: "customer" }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: billings.length,
      data: billings
    });
  } catch (error) {
    next(error);
  }
};

// Get billing by ID
exports.getBillingById = async (req, res, next) => {
  try {
    const billing = await Billing.findById(req.params.id)
      .populate({
        path: "service",
        populate: { path: "customer" }
      });

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found"
      });
    }

    res.json({
      success: true,
      data: billing
    });
  } catch (error) {
    next(error);
  }
};

// Update billing
exports.updateBilling = async (req, res, next) => {
  try {
    const { paidAmount, emiDueDate } = req.body;

    const billing = await Billing.findById(req.params.id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found"
      });
    }

    if (paidAmount !== undefined) {
      billing.paidAmount = paidAmount;

      if (paidAmount >= billing.totalAmount) {
        billing.paymentStatus = "Paid";
      } else if (paidAmount > 0) {
        billing.paymentStatus = "Partial";
      } else {
        billing.paymentStatus = "Pending";
      }
    }

    if (emiDueDate) {
      billing.emiDueDate = emiDueDate;
    }

    await billing.save();
    await billing.populate({
      path: "service",
      populate: { path: "customer" }
    });

    res.json({
      success: true,
      data: billing
    });
  } catch (error) {
    next(error);
  }
};

// Delete billing
exports.deleteBilling = async (req, res, next) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found"
      });
    }

    res.json({
      success: true,
      message: "Billing record deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get due today
exports.getDueToday = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const billings = await Billing.find({
      emiDueDate: {
        $gte: today,
        $lt: tomorrow
      },
      paymentStatus: { $ne: "Paid" }
    }).populate({
      path: "service",
      populate: { path: "customer" }
    });

    res.json({
      success: true,
      count: billings.length,
      data: billings
    });
  } catch (error) {
    next(error);
  }
};

// Get overdue billings
exports.getOverdue = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const billings = await Billing.find({
      emiDueDate: { $lt: today },
      paymentStatus: { $ne: "Paid" }
    }).populate({
      path: "service",
      populate: { path: "customer" }
    }).sort({ emiDueDate: 1 });

    res.json({
      success: true,
      count: billings.length,
      data: billings
    });
  } catch (error) {
    next(error);
  }
};

// Record payment
exports.recordPayment = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const billing = await Billing.findById(req.params.id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found"
      });
    }

    billing.paidAmount += amount;

    if (billing.paidAmount >= billing.totalAmount) {
      billing.paymentStatus = "Paid";
    } else if (billing.paidAmount > 0) {
      billing.paymentStatus = "Partial";
    }

    await billing.save();
    await billing.populate({
      path: "service",
      populate: { path: "customer" }
    });

    res.json({
      success: true,
      data: billing
    });
  } catch (error) {
    next(error);
  }
};

