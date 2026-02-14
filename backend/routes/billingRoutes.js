const express = require("express");
const {
  createBilling,
  getAllBilling,
  getBillingById,
  updateBilling,
  deleteBilling,
  getDueToday,
  getOverdue,
  recordPayment
} = require("../controllers/billingController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// All routes require authentication
router.use(auth);

// Billing routes
/**
 * @swagger
 * /api/billing/due-today:
 *   get:
 *     summary: Get billing due today
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: List of due billings
 */
router.get("/due-today", getDueToday);

/**
 * @swagger
 * /api/billing/overdue:
 *   get:
 *     summary: Get overdue billings
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: List of overdue billings
 */
router.get("/overdue", getOverdue);

/**
 * @swagger
 * /api/billing:
 *   post:
 *     summary: Create a billing record
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [service, totalAmount]
 *             properties:
 *               service:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               paidAmount:
 *                 type: number
 *               emiDueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Billing created
 */
router.post("/", role(["admin"]), createBilling);

/**
 * @swagger
 * /api/billing:
 *   get:
 *     summary: Get all billing records
 *     tags: [Billing]
 *     parameters:
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of billing records
 */
router.get("/", getAllBilling);

/**
 * @swagger
 * /api/billing/{id}:
 *   get:
 *     summary: Get billing by ID
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billing detail
 *       404:
 *         description: Billing not found
 */
router.get("/:id", getBillingById);

/**
 * @swagger
 * /api/billing/{id}:
 *   put:
 *     summary: Update billing
 *     tags: [Billing]
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
 *               paidAmount:
 *                 type: number
 *               emiDueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Billing updated
 *       404:
 *         description: Billing not found
 */
router.put("/:id", role(["admin"]), updateBilling);

/**
 * @swagger
 * /api/billing/{id}/payment:
 *   patch:
 *     summary: Record a payment
 *     tags: [Billing]
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
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment recorded
 *       404:
 *         description: Billing not found
 */
router.patch("/:id/payment", recordPayment);

/**
 * @swagger
 * /api/billing/{id}:
 *   delete:
 *     summary: Delete a billing record
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billing deleted
 *       404:
 *         description: Billing not found
 */
router.delete("/:id", role(["admin"]), deleteBilling);
module.exports = router;
