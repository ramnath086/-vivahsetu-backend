const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Advanced Profile
    profile: {
        // Personal Details
        gender: String,
        dob: Date,
        height: String,
        maritalStatus: String,
        
        // Religious Details
        religion: { type: String, default: 'Hindu' },
        caste: String,
        subCaste: String,
        gotra: String,
        manglik: Boolean,
        
        // Education & Career
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
        
        // Location
        location: {
            city: String,
            state: String,
            country: String
        },
        
        // Photos
        photo: String,
        
        // About
        about: String,
        hobbies: [String]
    },
    
    isProfileVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
