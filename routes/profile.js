const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get my profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update basic profile
router.put('/basic', auth, async (req, res) => {
    try {
        const { name, gender, dob, height, maritalStatus } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user.profile) user.profile = {};
        
        user.name = name || user.name;
        user.profile.gender = gender || user.profile.gender;
        user.profile.dob = dob || user.profile.dob;
        user.profile.height = height || user.profile.height;
        user.profile.maritalStatus = maritalStatus || user.profile.maritalStatus;
        
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update religious details
router.put('/religious', auth, async (req, res) => {
    try {
        const { caste, subCaste, gotra, manglik } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user.profile) user.profile = {};
        
        user.profile.caste = caste || user.profile.caste;
        user.profile.subCaste = subCaste || user.profile.subCaste;
        user.profile.gotra = gotra || user.profile.gotra;
        user.profile.manglik = manglik || user.profile.manglik;
        
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update education & career
router.put('/professional', auth, async (req, res) => {
    try {
        const { education, occupation } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user.profile) user.profile = {};
        
        if (education) {
            user.profile.education = education;
        }
        
        if (occupation) {
            user.profile.occupation = occupation;
        }
        
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update location
router.put('/location', auth, async (req, res) => {
    try {
        const { city, state, country } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user.profile) user.profile = {};
        if (!user.profile.location) user.profile.location = {};
        
        user.profile.location.city = city || user.profile.location.city;
        user.profile.location.state = state || user.profile.location.state;
        user.profile.location.country = country || user.profile.location.country;
        
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update about & hobbies
router.put('/about', auth, async (req, res) => {
    try {
        const { about, hobbies } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user.profile) user.profile = {};
        
        user.profile.about = about || user.profile.about;
        if (hobbies && Array.isArray(hobbies)) {
            user.profile.hobbies = hobbies;
        }
        
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
