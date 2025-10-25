import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },

    // 🔹 Payment Info
    razorpayOrderId: { type: String },  // generated order_id from Razorpay
    razorpayPaymentId: { type: String }, // payment_id returned after successful payment
    razorpaySignature: { type: String }, // signature to verify authenticity
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // 🔹 Order Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
