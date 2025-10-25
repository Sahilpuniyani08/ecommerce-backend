import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});
