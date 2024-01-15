const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  total: { type: Number, required: true },
  paymentDetails: {
    method: { type: String, required: true },
    transactionId: { type: String },
  },
  personalDetails: {
    name: { type: String, required: true },
    phone : { type: Number, required: true},
    address: { type: String, required: true },
  },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
