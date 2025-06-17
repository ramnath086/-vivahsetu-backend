const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email Templates
const emailTemplates = {
    welcome: (name) => ({
        subject: 'Welcome to VivahSetu - Find Your Perfect Match!',
        html: `
            <h2>Welcome to VivahSetu, ${name}!</h2>
            <p>Thank you for joining VivahSetu. We're excited to help you find your perfect life partner.</p>
            <p>Get started by:</p>
            <ul>
                <li>Complete your profile</li>
                <li>Add your photos</li>
                <li>Set your partner preferences</li>
            </ul>
            <p>Best wishes on your journey!</p>
        `
    }),
    
    newMatch: (name, matchName) => ({
        subject: 'New Match Found on VivahSetu!',
        html: `
            <h2>Hello ${name},</h2>
            <p>We found a new match for you: ${matchName}</p>
            <p>Login to view their complete profile and express interest!</p>
        `
    }),

    interestReceived: (name, fromName) => ({
        subject: 'Someone Expressed Interest in Your Profile!',
        html: `
            <h2>Hello ${name},</h2>
            <p>${fromName} has expressed interest in your profile.</p>
            <p>Login now to view their profile and respond!</p>
        `
    }),

    premiumExpiring: (name, daysLeft) => ({
        subject: 'Your Premium Membership is Expiring Soon!',
        html: `
            <h2>Hello ${name},</h2>
            <p>Your premium membership will expire in ${daysLeft} days.</p>
            <p>Renew now to continue enjoying premium benefits!</p>
        `
    })
};

// Send Email Function
const sendEmail = async (to, template, data) => {
    try {
        const { subject, html } = emailTemplates[template](data);
        
        await transporter.sendMail({
            from: '"VivahSetu" <noreply@vivahsetu.com>',
            to,
            subject,
            html
        });

        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

module.exports = { sendEmail };
