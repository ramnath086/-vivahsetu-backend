const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
// Add this line with other routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/interest', require('./routes/interest'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/search', require('./routes/search'));
app.use('/api/photo', require('./routes/photo'));
// We'll add premium routes later
// app.use('/api/premium', require('./routes/premium'));
app.use('/api/chat', require('./routes/chat'));

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to VivahSetu API',
        status: 'Running'
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
