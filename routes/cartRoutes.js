// routes/cartRoutes.js
import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";

import { cartItemSchema } from "../validators/cartValidator.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, validate(cartItemSchema), addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);

export default router;
