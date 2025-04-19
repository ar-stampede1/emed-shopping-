require('dotenv').config();

const cashfreeConfig = {
    baseUrl: "https://sandbox.cashfree.com/pg", // Use "https://api.cashfree.com/pg" for LIVE
    clientId: process.env.CASHFREE_APP_ID,
    clientSecret: process.env.CASHFREE_SECRET_KEY
};

module.exports = { cashfreeConfig };
