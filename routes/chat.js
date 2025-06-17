const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// Send message
router.post('/send/:userId', auth, async (req, res) => {
    try {
        const receiver = await User.findById(req.params.userId);
        if (!receiver) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const message = new Message({
            sender: req.user.id,
            receiver: req.params.userId,
            content: req.body.content
        });

        await message.save();
        res.json(message);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get chat history
router.get('/history/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        })
        .sort('createdAt');
        
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all conversations
router.get('/conversations', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        })
        .sort('-createdAt');
        
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
