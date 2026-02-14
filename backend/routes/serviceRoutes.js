const express = require("express");
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByTechnician,
  getServicesByCustomer
} = require("../controllers/serviceController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// All routes require authentication
router.use(auth);

// Service routes
/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a service request
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customer, deviceType, issue]
 *             properties:
 *               customer:
 *                 type: string
 *               deviceType:
 *                 type: string
 *               issue:
 *                 type: string
 *               estimatedCost:
 *                 type: number
 *               assignedTechnician:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created
 */
router.post("/", role(["admin"]), createService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of services
 */
router.get("/", getAllServices);

/**
 * @swagger
 * /api/services/technician/{technicianId}:
 *   get:
 *     summary: Get services by technician
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of services
 */
router.get("/technician/:technicianId", getServicesByTechnician);

/**
 * @swagger
 * /api/services/customer/{customerId}:
 *   get:
 *     summary: Get services by customer
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of services
 */
router.get("/customer/:customerId", getServicesByCustomer);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service detail
 *       404:
 *         description: Service not found
 */
router.get("/:id", getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
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
 *               status:
 *                 type: string
 *               actualCost:
 *                 type: number
 *               assignedTechnician:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Service not found
 */
router.put("/:id", updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 *       404:
 *         description: Service not found
 */
router.delete("/:id", role(["admin"]), deleteService);
module.exports = router;
