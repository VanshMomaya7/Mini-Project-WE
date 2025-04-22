const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// Process payment
router.post('/process', auth, async (req, res) => {
    try {
        const { orderId, paymentMethod, amount } = req.body;
        console.log('Processing payment:', { orderId, paymentMethod, amount });

        // Find the order first
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (paymentMethod === 'cod') {
            // For COD, mark as pending payment but confirmed order
            order.paymentStatus = 'pending';
            order.status = 'confirmed';
            order.paymentMethod = 'cod';
            await order.save();

            return res.json({
                success: true,
                message: 'COD order confirmed',
                orderId: order._id
            });
        }

        // For card payments, simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate payment success/failure (90% success rate)
        const isSuccess = Math.random() < 0.9;

        if (!isSuccess) {
            throw new Error('Payment failed');
        }

        // Update order status for successful card payment
        order.paymentStatus = 'completed';
        order.status = 'processing';
        order.paymentMethod = paymentMethod;
        await order.save();

        res.json({
            success: true,
            message: 'Payment processed successfully',
            transactionId: 'TXN' + Date.now(),
            orderId: order._id
        });

    } catch (error) {
        console.error('Payment error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Payment failed'
        });
    }
});

// Verify payment status
router.get('/status/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            success: true,
            paymentStatus: order.paymentStatus,
            orderStatus: order.status
        });

    } catch (error) {
        res.status(500).json({ message: 'Error checking payment status' });
    }
});

module.exports = router;
