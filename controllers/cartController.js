import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Add product to cart
export const addToCart = async (req, res) => {
  const userId = req.user.id; // ✅ Get user ID from JWT
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);

    if (cart) {
      const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

      if (itemIndex > -1) {
        if (product && product.stock < quantity + cart.products[itemIndex].quantity) {
          return res.status(400).json({ message: "Limited stock available!" });
        } else {
          cart.products[itemIndex].quantity += quantity;
        }
      } else {
        cart.products.push({ productId, quantity });
      }
      cart = await cart.save();
    } else {
      cart = await Cart.create({
        userId,
        products: [{ productId, quantity }],
      });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart by user
export const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId", "name price image");

    if (!cart) return res.status(200).json([]);

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  const userId = req.user.id; // ✅ Get user ID from JWT
  const { productId } = req.params;
  console.log(productId)

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p._id.toString() !== productId);
    console.log("Cart", cart)
    cart = await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};