
const express = require('express');
const router = express.Router();
const { addToCart, updateCartItem, removeFromCart } = require('./cartController');
const { authMiddleware } = require('../authMiddleware');

router.post('/addToCart', authMiddleware, addToCart);
router.put('/updateCartItem', authMiddleware, updateCartItem);
router.delete('/removeFromCart/:productId', authMiddleware, removeFromCart);

module.exports = router;
