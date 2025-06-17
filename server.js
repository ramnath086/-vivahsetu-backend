const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something broke!',
        message: err.message 
    });
});

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to VivahSetu API',
        status: 'running'
    });
});

// Basic registration route
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);  // Debug log

        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ 
                msg: 'Please enter all fields',
                received: { name, email, password: '****' }
            });
        }

        // Create user object (without saving yet)
        const user = {
            name,
            email,
            password
        };

        // Return success response
        res.json({ 
            message: 'Registration successful',
            user: { name, email }
        });

    } catch (err) {
        console.error('Registration error:', err);  // Debug log
        res.status(500).json({ 
            error: 'Registration failed',
            message: err.message 
        });
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

const PORT = process.env.PORT || 5000;

module.exports = app;
