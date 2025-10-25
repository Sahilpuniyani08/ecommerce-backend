import express from "express";
import { createOrder, getOrders, updateOrderStatus, verifyPayment } from "../controllers/orderController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer: place order + view own orders

router.post("/", protect, createOrder); // Step 1: Start payment
router.post("/verify", protect, verifyPayment); // Step 2: Verify + save DB order
router.get("/", protect, getOrders); // Get all orders for a user

// Admin: update order status
router.put("/:orderId", protect, isAdmin, updateOrderStatus); // Update status

export default router;
