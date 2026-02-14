const Service = require("../models/Service");

// Create a new service request
exports.createService = async (req, res, next) => {
  try {
    const { customer, deviceType, issue, estimatedCost, assignedTechnician } = req.body;

    const service = await Service.create({
      customer,
      deviceType,
      issue,
      estimatedCost,
      assignedTechnician,
      status: "Pending"
    });

    await service.populate("customer assignedTechnician");

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Get all services
exports.getAllServices = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const services = await Service.find(filter)
      .populate("customer assignedTechnician")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// Get service by ID
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("customer assignedTechnician");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Update service
exports.updateService = async (req, res, next) => {
  try {
    const { status, actualCost, assignedTechnician } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status, actualCost, assignedTechnician },
      { new: true, runValidators: true }
    ).populate("customer assignedTechnician");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Delete service
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get services by technician
exports.getServicesByTechnician = async (req, res, next) => {
  try {
    const services = await Service.find({ assignedTechnician: req.params.technicianId })
      .populate("customer assignedTechnician")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// Get services by customer
exports.getServicesByCustomer = async (req, res, next) => {
  try {
    const services = await Service.find({ customer: req.params.customerId })
      .populate("customer assignedTechnician")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};
