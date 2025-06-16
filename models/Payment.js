const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: String,
    paymentId: String,
    amount: Number,
    plan: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    validUntil: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
