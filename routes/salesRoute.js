const express = require('express');
const Order = require('../models/order');
const { authMiddleware, isAdmin } = require('../authMiddleware');
const router = express.Router();

router.get('/productSales', authMiddleware, isAdmin, async (req, res) => {
    try {
        const productSales = await Order.aggregate([
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.product',
                    totalSales: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
                    totalQuantity: { $sum: '$orderItems.quantity' }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    totalSales: 1,
                    totalQuantity: 1,
                    productName: '$productDetails.name'
                }
            }
        ]);
        res.json(productSales);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/overallSales', authMiddleware, isAdmin, async (req, res) => {
    try {
        const overallSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);
        res.json(overallSales);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;