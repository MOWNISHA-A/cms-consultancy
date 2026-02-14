const express = require("express");
const {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  updateStock
} = require("../controllers/inventoryController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// All routes require authentication
router.use(auth);

// Inventory routes
/**
 * @swagger
 * /api/inventory/low-stock:
 *   get:
 *     summary: Get low stock items
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: number
 *           example: 5
 *     responses:
 *       200:
 *         description: List of low stock items
 */
router.get("/low-stock", getLowStockItems);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create an inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [spareName, stock]
 *             properties:
 *               spareName:
 *                 type: string
 *               stock:
 *                 type: number
 *               purchaseCost:
 *                 type: number
 *     responses:
 *       201:
 *         description: Inventory item created
 */
router.post("/", role(["admin"]), createInventoryItem);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of inventory items
 */
router.get("/", getAllInventoryItems);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item detail
 *       404:
 *         description: Inventory item not found
 */
router.get("/:id", getInventoryItemById);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update inventory item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spareName:
 *                 type: string
 *               stock:
 *                 type: number
 *               purchaseCost:
 *                 type: number
 *     responses:
 *       200:
 *         description: Inventory item updated
 *       404:
 *         description: Inventory item not found
 */
router.put("/:id", role(["admin"]), updateInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}/stock:
 *   patch:
 *     summary: Update stock for an item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity, operation]
 *             properties:
 *               quantity:
 *                 type: number
 *               operation:
 *                 type: string
 *                 enum: [add, remove]
 *     responses:
 *       200:
 *         description: Stock updated
 *       400:
 *         description: Insufficient stock
 */
router.patch("/:id/stock", updateStock);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item deleted
 *       404:
 *         description: Inventory item not found
 */
router.delete("/:id", role(["admin"]), deleteInventoryItem);
module.exports = router;
