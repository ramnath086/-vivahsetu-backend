// Temporary solution until Razorpay is needed
const dummyRazorpay = {
    orders: {
        create: async () => {
            throw new Error('Payment feature coming soon');
        }
    }
};

module.exports = dummyRazorpay;
