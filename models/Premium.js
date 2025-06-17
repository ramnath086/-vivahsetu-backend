const mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['silver', 'gold', 'platinum'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    features: [{
        type: String
    }],
    paymentId: String,
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    }
});

module.exports = mongoose.model('Premium', premiumSchema);
