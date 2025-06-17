const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    isProfilePic: {
        type: Boolean,
        default: false
    },
    caption: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Photo', photoSchema);
