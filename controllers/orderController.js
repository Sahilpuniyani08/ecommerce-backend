import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Step 1: Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let totalAmount = 0;
    cart.products.forEach((item) => {
      totalAmount += item.productId.price * item.quantity;
    });

    // ✅ Create Razorpay order
    const options = {
      amount: totalAmount * 100, // in paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };
    console.log(options)
    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      cartId: cart._id,
      currency: "INR",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Step 2: Verify Payment & Save Order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId } = req.body;
   console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId )
    const userId = req.user.id;

    // ✅ Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Fetch cart again
    const cart = await Cart.findById(cartId).populate("products.productId");
    if (!cart) return res.status(400).json({ error: "Cart not found" });

    let totalAmount = 0;
    cart.products.forEach((item) => {
      totalAmount += item.productId.price * item.quantity;
    });

    // ✅ Update stock
    for (const item of cart.products) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // ✅ Save order in DB with Razorpay details
    const newOrder = new Order({
      userId,
      products: cart.products.map((p) => ({
        productId: p.productId._id,
        quantity: p.quantity,
      })),
      amount: totalAmount,
      status: "pending", // Business order status
      paymentStatus: "paid", // Razorpay status
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    await newOrder.save();
    await Cart.findByIdAndDelete(cartId);

    res.json({ success: true, message: "Payment verified & order placed", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✅ Get user orders (customer)
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ get user ID from JWT
    const orders = await Order.find({ userId }).populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
