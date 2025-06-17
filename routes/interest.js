const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Interest = require('../models/Interest');
const User = require('../models/User');

// Send Interest
router.post('/send/:userId', auth, async (req, res) => {
    try {
        const toUser = await User.findById(req.params.userId);
        if (!toUser) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        // Check if interest already sent
        const existingInterest = await Interest.findOne({
            from: req.user.id,
            to: req.params.userId
        });

        if (existingInterest) {
            return res.status(400).json({ msg: 'Interest already sent' });
        }

        const interest = new Interest({
            from: req.user.id,
            to: req.params.userId,
            message: req.body.message
        });

        await interest.save();
        res.json(interest);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Received Interests
router.get('/received', auth, async (req, res) => {
    try {
        const interests = await Interest.find({ to: req.user.id })
            .populate('from', 'name profile.photo')
            .sort('-createdAt');
        res.json(interests);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Accept/Reject Interest
router.put('/respond/:interestId', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const interest = await Interest.findById(req.params.interestId);

        if (!interest) {
            return res.status(404).json({ msg: 'Interest not found' });
        }

        if (interest.to.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        interest.status = status;
        await interest.save();
        res.json(interest);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
