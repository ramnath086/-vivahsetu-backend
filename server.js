const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to VivahSetu API',
        status: 'running'
    });
});

// Create Profile
app.post('/api/profile/create', async (req, res) => {
    try {
        const {
            name,
            gender,
            age,
            caste,
            location,
            education,
            occupation
        } = req.body;

        const profile = {
            name,
            gender,
            age,
            caste,
            location,
            education,
            occupation
        };

        res.json({
            message: 'Profile created successfully',
            profile
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Profile creation failed',
            message: err.message 
        });
    }
});

// Get All Profiles
app.get('/api/profiles', async (req, res) => {
    try {
        const profiles = [
            {
                name: "Test Profile 1",
                gender: "Male",
                age: 28,
                location: "Mumbai",
                education: "B.Tech",
                occupation: "Software Engineer"
            },
            {
                name: "Test Profile 2",
                gender: "Female",
                age: 25,
                location: "Delhi",
                education: "M.B.A",
                occupation: "Business Analyst"
            }
        ];

        res.json({
            success: true,
            count: profiles.length,
            profiles: profiles
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to fetch profiles',
            message: err.message 
        });
    }
});

// Search Profiles
app.get('/api/search', (req, res) => {
    try {
        // Get search parameters
        const { gender, ageFrom, ageTo, location } = req.query;

        // Sample profiles (same as above for now)
        const profiles = [
            {
                name: "Test Profile 1",
                gender: "Male",
                age: 28,
                location: "Mumbai",
                education: "B.Tech",
                occupation: "Software Engineer"
            },
            {
                name: "Test Profile 2",
                gender: "Female",
                age: 25,
                location: "Delhi",
                education: "M.B.A",
                occupation: "Business Analyst"
            }
        ];

        res.json({
            success: true,
            parameters: { gender, ageFrom, ageTo, location },
            count: profiles.length,
            profiles: profiles
        });

    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Search failed',
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

module.exports = app;
