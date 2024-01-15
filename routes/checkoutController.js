const Order = require('../models/order');
const User = require('../models/users');
const jwt = require("jsonwebtoken");

const processPayment = (user, paymentDetails) => {
  if (paymentDetails.paymentMethod === 'COD') {
    return {
      success: true,
      paymentMethod: 'COD',
    };
  } else if (paymentDetails.paymentMethod === 'Debit/Credit Card') {
    return {
      success: true,
      transactionId: `txn_${new Date().getTime()}`,
      amountPaid: user.cartTotal,
      paymentMethod: paymentDetails.paymentMethod,
    };
  } else {
    return {
      success: false,
      message: 'Unsupported payment method',
    };
  }
};

const generateReceipt = (order, paymentResult) => {
  return {
    receiptId: `rcpt_${new Date().getTime()}`,
    order: order._id,
    transactionId: paymentResult.transactionId,
    amountPaid: paymentResult.amountPaid || order.total,
    paymentMethod: paymentResult.paymentMethod,
    date: new Date(),
  };
};

exports.checkout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { personalDetails, paymentDetails } = req.body;
    const orderItems = user.cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const orderTotal = orderItems.reduce((total, item) => total + (item.quantity * item.price), 0);
    const order = new Order({
      user: user._id,
      orderItems,
      total: orderTotal,
      paymentDetails,
      personalDetails,
    });
    const savedOrder = await order.save();

    user.cart = [];
    user.cartTotal = 0;
    await user.save();

    res.status(201).json({
      message: "Checkout successful",
      order: savedOrder,
});
} catch (error) {
  console.error("Checkout error:", error);
  res.status(500).json({ message: "Server error during checkout", error: error.message });
}
};

