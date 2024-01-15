const express = require('express');
const { checkout } = require('./checkoutRoutes'); 
const { authMiddleware } = require('../authMiddleware');

const router = express.Router();

router.post('/checkout', authMiddleware, checkout);

module.exports = router;
