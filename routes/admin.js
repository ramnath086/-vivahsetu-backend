const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Premium = require('../models/Premium');

// Admin Dashboard Stats
router.get('/stats', auth, async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments(),
            premiumUsers: await User.countDocuments({ isPremium: true }),
            verifiedProfiles: await User.countDocuments({ 'profile.isVerified': true }),
            pendingVerification: await User.countDocuments({ 'profile.isVerified': false }),
            todayRegistrations: await User.countDocuments({
                createdAt: {
                    $gte: new Date().setHours(0, 0, 0, 0)
                }
            }),
            premiumRevenue: await Premium.aggregate([
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        };

        res.json(stats);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get All Users (with pagination)
router.get('/users', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort('-createdAt');

        const total = await User.countDocuments();

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Verify User Profile
router.put('/verify-profile/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!user.profile) user.profile = {};
        user.profile.isVerified = true;
        user.profile.verifiedAt = Date.now();
        user.profile.verifiedBy = req.admin.id;

        await user.save();

        res.json({ msg: 'Profile verified successfully', user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Premium Users
router.get('/premium-users', auth, async (req, res) => {
    try {
        const premiumUsers = await User.find({ isPremium: true })
            .select('-password')
            .sort('-premiumValidTill');

        res.json(premiumUsers);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Recent Activities
router.get('/activities', auth, async (req, res) => {
    try {
        const recentUsers = await User.find()
            .select('name email createdAt')
            .sort('-createdAt')
            .limit(5);

        const recentPremium = await Premium.find()
            .populate('user', 'name email')
            .sort('-startDate')
            .limit(5);

        res.json({
            recentUsers,
            recentPremium
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Block/Unblock User
router.put('/toggle-block/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            msg: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Search Users
router.get('/search', auth, async (req, res) => {
    try {
        const { query } = req.query;
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { 'profile.location.city': { $regex: query, $options: 'i' } }
            ]
        }).select('-password');

        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
