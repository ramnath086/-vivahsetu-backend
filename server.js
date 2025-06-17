const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Explicitly set content type for all responses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Test route
app.use('/api/auth', require('./routes/auth'));
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to VivahSetu API',
        status: 'running'
    });
});

// Test DB connection
app.get('/test-db', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        res.json({ 
            message: 'MongoDB Connected Successfully',
            status: 'connected'
        });
    } catch (err) {
        res.status(500).json({ 
            error: err.message,
            status: 'failed'
        });
    }
});

// Basic registration route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        res.json({ 
            message: 'Registration endpoint working',
            receivedData: { name, email },
            status: 'success'
        });
    } catch (err) {
        res.status(500).json({ 
            error: err.message,
            status: 'failed'
        });
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

module.exports = app;
