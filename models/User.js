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
        education: {
            degree: String,
            college: String,
            year: Number
        },
        occupation: {
            type: String,
            company: String,
            income: String
        },
        location: {
            city: String,
            state: String,
            country: String
        },
        photo: String,
        about: String,
        hobbies: [String]
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumPlan: {
        type: String,
        enum: ['silver', 'gold', 'platinum'],
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
