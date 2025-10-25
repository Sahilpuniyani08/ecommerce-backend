// routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";
import { productSchema } from "../validators/productValidator.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/upload.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// middleware to cast numeric fields before validation
const parseNumbers = (req, res, next) => {
  if (req.body.price) req.body.price = Number(req.body.price);
  if (req.body.stock) req.body.stock = Number(req.body.stock);
  next();
};

// Public: anyone can see products
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only: add products
router.post(
  "/",
  protect,
  isAdmin,
  upload.single("image"),
  parseNumbers,
  validate(productSchema),
  createProduct
);

export default router;
