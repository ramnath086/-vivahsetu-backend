const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Premium Plans Configuration
const PREMIUM_PLANS = {
    silver: {
        id: 'silver',
        name: 'Silver Package',
        price: 499,
        duration: 30, // days
        features: [
            'View contact details',
            'Send direct messages',
            'Advanced search filters'
        ]
    },
    gold: {
        id: 'gold',
        name: 'Gold Package',
        price: 999,
        duration: 90, // days
        features: [
            'All Silver features',
            'Upload multiple photos',
            'Priority in search results',
            'See profile visitors'
        ]
    },
    platinum: {
        id: 'platinum',
        name: 'Platinum Package',
        price: 1999,
        duration: 180, // days
        features: [
            'All Gold features',
            'Dedicated relationship manager',
            'Background verification',
            'Premium badge',
            'Horoscope matching'
        ]
    }
};

// Get all premium plans
router.get('/plans', (req, res) => {
    try {
        res.json({
            success: true,
            plans: PREMIUM_PLANS
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Get user's premium status
router.get('/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.isPremium) {
            return res.json({
                isPremium: false,
                message: 'No active premium membership'
            });
        }

        res.json({
            isPremium: true,
            plan: user.premiumPlan,
            features: PREMIUM_PLANS[user.premiumPlan].features,
            validTill: user.premiumValidTill
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Initiate premium purchase
router.post('/purchase', auth, async (req, res) => {
    try {
        const { planId } = req.body;
        
        // Validate plan
        if (!PREMIUM_PLANS[planId]) {
            return res.status(400).json({ msg: 'Invalid plan selected' });
        }

        const plan = PREMIUM_PLANS[planId];
        
        // Create order
        const orderData = {
            amount: plan.price * 100, // Convert to paise
            currency: 'INR',
            receipt: `premium_${Date.now()}_${req.user.id}`,
            notes: {
                userId: req.user.id,
                planId: planId
            }
        };

        res.json({
            success: true,
            plan: plan,
            orderData: orderData
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Verify premium purchase
router.post('/verify', auth, async (req, res) => {
    try {
        const { planId, paymentId } = req.body;
        
        const user = await User.findById(req.user.id);
        const plan = PREMIUM_PLANS[planId];

        if (!plan) {
            return res.status(400).json({ msg: 'Invalid plan' });
        }

        // Calculate validity
        const validTill = new Date();
        validTill.setDate(validTill.getDate() + plan.duration);

        // Update user premium status
        user.isPremium = true;
        user.premiumPlan = planId;
        user.premiumValidTill = validTill;
        user.paymentId = paymentId;

        await user.save();

        res.json({
            success: true,
            message: 'Premium activated successfully',
            plan: plan,
            validTill: validTill
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Get premium features
router.get('/features', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.isPremium) {
            return res.json({
                features: [],
                message: 'Upgrade to premium to unlock features'
            });
        }

        const plan = PREMIUM_PLANS[user.premiumPlan];
        
        res.json({
            success: true,
            features: plan.features,
            plan: plan.name
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
