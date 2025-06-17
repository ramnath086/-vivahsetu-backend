const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to VivahSetu API' });
});

// Test route to check MongoDB connection
app.get('/test-db', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        res.json({ message: 'MongoDB Connected Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Basic registration route
app.post('/api/auth/register', async (req, res) => {
    try {
        res.json({ 
            message: 'Registration route working',
            receivedData: req.body 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });
