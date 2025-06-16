const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay');
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Create payment order
router.post('/create-order', auth, async (req, res) => {
    try {
        const options = {
            amount: 49900, // ₹499
            currency: "INR",
            receipt: `order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        
        const payment = new Payment({
            user: req.user.id,
            orderId: order.id,
            amount: options.amount,
            plan: 'monthly'
        });
        
        await payment.save();
        res.json(order);
    } catch (err) {
        res.status(500).send('Payment creation failed');
    }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id } = req.body;
        
        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        payment.status = 'completed';
        payment.paymentId = razorpay_payment_id;
        
        const validUntil = new Date();
        validUntil.setMonth(validUntil.getMonth() + 1);
        payment.validUntil = validUntil;
        
        await payment.save();
        
        const user = await User.findById(req.user.id);
        user.isPremium = true;
        await user.save();
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).send('Payment verification failed');
    }
});

module.exports = router;
