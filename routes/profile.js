const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get my profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update profile
router.put('/update', auth, async (req, res) => {
    try {
        const {
            gender, dob, height, caste, subCaste, gotra,
            education, occupation, income, location, about
        } = req.body;

        const user = await User.findById(req.user.id);
        
        user.profile = {
            gender, dob, height, caste, subCaste, gotra,
            education, occupation, income, location, about,
            photo: user.profile?.photo
        };

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
