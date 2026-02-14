const Inventory = require("../models/Inventory");

// Create a new inventory item
exports.createInventoryItem = async (req, res, next) => {
  try {
    const { spareName, stock, purchaseCost } = req.body;

    const item = await Inventory.create({
      spareName,
      stock,
      purchaseCost
    });

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Get all inventory items
exports.getAllInventoryItems = async (req, res, next) => {
  try {
    const items = await Inventory.find().sort({ spareName: 1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Get inventory item by ID
exports.getInventoryItemById = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Update inventory item
exports.updateInventoryItem = async (req, res, next) => {
  try {
    const { spareName, stock, purchaseCost } = req.body;

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { spareName, stock, purchaseCost },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Delete inventory item
exports.deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    res.json({
      success: true,
      message: "Inventory item deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res, next) => {
  try {
    const threshold = req.query.threshold || 5;

    const items = await Inventory.find({
      stock: { $lte: threshold }
    }).sort({ stock: 1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Update stock (add or remove)
exports.updateStock = async (req, res, next) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'remove'

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    if (operation === "add") {
      item.stock += quantity;
    } else if (operation === "remove") {
      if (item.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock"
        });
      }
      item.stock -= quantity;
    }

    await item.save();

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};
