const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Search profiles
router.get('/', auth, async (req, res) => {
    try {
        const { gender, ageFrom, ageTo, caste, location } = req.query;
        
        const query = {};
        
        // Add filters
        if (gender) query['profile.gender'] = gender;
        if (caste) query['profile.caste'] = caste;
        if (location) query['profile.location'] = location;
        if (ageFrom || ageTo) {
            query['profile.dob'] = {};
            if (ageFrom) {
                const fromDate = new Date();
                fromDate.setFullYear(fromDate.getFullYear() - parseInt(ageFrom));
                query['profile.dob'].$lte = fromDate;
            }
            if (ageTo) {
                const toDate = new Date();
                toDate.setFullYear(toDate.getFullYear() - parseInt(ageTo));
                query['profile.dob'].$gte = toDate;
            }
        }

        const profiles = await User.find(query)
            .select('-password')
            .limit(20);

        res.json(profiles);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
