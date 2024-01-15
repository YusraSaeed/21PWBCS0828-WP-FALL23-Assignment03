const User = require('../models/users');
const Product = require('../models/products');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, price: product.price });
    }
    user.cartTotal = user.cart.reduce((total, cartItem) => total + (cartItem.quantity * cartItem.price), 0);
    await user.save();
    res.status(200).json({
      cart: user.cart,
      cartTotal: user.cartTotal
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { userId } = req.user; 
  const { productId, quantity } = req.body; 
  try {
  const user = await User.findById(req.user._id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    user.cart[cartItemIndex].quantity = quantity;

    user.cartTotal = user.cart.reduce((total, cartItem) => {
      return total + (cartItem.quantity * cartItem.price);
    }, 0);
    await user.save(); 
    res.status(200).json({
      message: "Cart updated",
      cart: user.cart,
      cartTotal: user.cartTotal
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item.product.toString() !== productId);

user.calculateCartTotal();
await user.save();

res.status(200).json(user.cart);
} catch (error) {
  res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};
