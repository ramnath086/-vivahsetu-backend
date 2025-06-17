const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const User = require('../models/User');

const upload = multer({ dest: 'uploads/' });

// Upload profile photo
router.post('/upload', auth, upload.single('photo'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        
        const user = await User.findById(req.user.id);
        if (!user.profile) user.profile = {};
        
        // Store previous photo URL if exists
        const previousPhoto = user.profile.photo;
        
        // Update with new photo
        user.profile.photo = result.secure_url;
        await user.save();

        // If previous photo exists, delete from Cloudinary
        if (previousPhoto) {
            const publicId = previousPhoto.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        res.json({ 
            success: true, 
            photo: result.secure_url 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Upload failed');
    }
});

// Get user's profile photo
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.profile || !user.profile.photo) {
            return res.status(404).json({ msg: 'No profile photo found' });
        }
        res.json({ photo: user.profile.photo });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete profile photo
router.delete('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.profile || !user.profile.photo) {
            return res.status(404).json({ msg: 'No profile photo found' });
        }

        // Delete from Cloudinary
        const publicId = user.profile.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        // Remove photo URL from user profile
        user.profile.photo = undefined;
        await user.save();

        res.json({ msg: 'Profile photo removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Upload multiple photos (for premium users)
router.post('/upload-multiple', auth, upload.array('photos', 5), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Check if user is premium
        if (!user.isPremium) {
            return res.status(403).json({ msg: 'Premium membership required for multiple photos' });
        }

        const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
        const results = await Promise.all(uploadPromises);

        const photoUrls = results.map(result => result.secure_url);

        if (!user.profile) user.profile = {};
        if (!user.profile.additionalPhotos) user.profile.additionalPhotos = [];
        
        user.profile.additionalPhotos.push(...photoUrls);
        await user.save();

        res.json({ 
            success: true, 
            photos: photoUrls 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Upload failed');
    }
});

module.exports = router;
