const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// Send message
router.post('/send', auth, async (req, res) => {
    try {
        const { to, content } = req.body;
        
        const message = new Message({
            from: req.user.id,
            to,
            content
        });
        
        await message.save();
        
        // Socket.io will handle real-time delivery
        req.app.get('io').to(to).emit('newMessage', message);
        
        res.json(message);
    } catch (err) {
        res.status(500).send('Message sending failed');
    }
});

// Get conversations
router.get('/conversations', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { from: req.user.id },
                { to: req.user.id }
            ]
        })
        .sort('-createdAt')
        .populate('from to', 'name profile.photo');
        
        res.json(messages);
    } catch (err) {
        res.status(500).send('Failed to fetch messages');
    }
});

module.exports = router;
