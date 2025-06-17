const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendEmail } = require('../config/email');
const User = require('../models/User');

// Send Welcome Email
router.post('/welcome', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        const emailSent = await sendEmail(
            user.email,
            'welcome',
            user.name
        );

        res.json({ success: emailSent });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Notify About New Match
router.post('/new-match', auth, async (req, res) => {
    try {
        const { matchId } = req.body;
        const user = await User.findById(req.user.id);
        const match = await User.findById(matchId);

        const emailSent = await sendEmail(
            user.email,
            'newMatch',
            {
                name: user.name,
                matchName: match.name
            }
        );

        res.json({ success: emailSent });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Notify About Interest Received
router.post('/interest-received', auth, async (req, res) => {
    try {
        const { fromId } = req.body;
        const user = await User.findById(req.user.id);
        const fromUser = await User.findById(fromId);

        const emailSent = await sendEmail(
            user.email,
            'interestReceived',
            {
                name: user.name,
                fromName: fromUser.name
            }
        );

        res.json({ success: emailSent });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Notify Premium Expiring
router.post('/premium-expiring', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const daysLeft = Math.ceil((user.premiumValidTill - Date.now()) / (1000 * 60 * 60 * 24));

        const emailSent = await sendEmail(
            user.email,
            'premiumExpiring',
            {
                name: user.name,
                daysLeft
            }
        );

        res.json({ success: emailSent });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
