const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        gender: String,
        dob: Date,
        height: String,
        caste: String,
        subCaste: String,
        gotra: String,
        education: String,
        occupation: String,
        income: String,
        location: String,
        about: String,
        photo: String
    },
    preferences: {
        ageFrom: Number,
        ageTo: Number,
        caste: [String],
        education: [String],
        location: String
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
