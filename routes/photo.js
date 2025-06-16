const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const auth = require('../middleware/auth');
const User = require('../models/User');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth, upload.single('photo'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const user = await User.findById(req.user.id);
        
        if (!user.profile) user.profile = {};
        user.profile.photo = result.secure_url;
        
        await user.save();
        res.json({ photo: result.secure_url });
    } catch (err) {
        res.status(500).send('Upload failed');
    }
});

module.exports = router;
