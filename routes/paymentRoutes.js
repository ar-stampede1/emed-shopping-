const express = require('express');
const axios = require('axios');
const router = express.Router(); // ✅ Define router
const { cashfreeConfig } = require('../config/cashfreeConfig'); // ✅ Import config

// ✅ Route to verify payment status
router.get('/verify', async (req, res) => {
    try {
        const { order_id } = req.query; // Get order_id from query params

        const response = await axios.get(`${cashfreeConfig.baseUrl}/orders/${order_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2025-01-01',
                'x-client-id': cashfreeConfig.clientId,
                'x-client-secret': cashfreeConfig.clientSecret
            }
        });

        res.json({
            order_id: response.data.order_id,
            order_status: response.data.order_status, // Example: PAID, ACTIVE, FAILED
            transaction_id: response.data.cf_order_id, // Unique transaction ID
            payment_method: response.data.order_meta.payment_methods
        });

    } catch (error) {
        console.error("❌ Cashfree Payment Verification Error:", error.response ? error.response.data : error.message);
        res.status(500).json({
            message: "Error verifying payment",
            error: error.response ? error.response.data : error.message
        });
    }
});


// ✅ Route to create a payment order
router.post('/create-order', async (req, res) => {
    try {
        let { orderId, amount, customerName, customerEmail, phone } = req.body;

        // ✅ Generate a unique order ID (append timestamp)
        orderId = `${orderId}_${Date.now()}`;

        const paymentData = {
            order_id: orderId,
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_id: orderId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: phone
            },
            order_meta: {
                payment_methods: "upi"
            }
        };

        const response = await axios.post(`${cashfreeConfig.baseUrl}/orders`, paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2025-01-01',
                'x-client-id': cashfreeConfig.clientId,
                'x-client-secret': cashfreeConfig.clientSecret
            }
        });

        // Extract session ID and generate payment link
        const sessionId = response.data.payment_session_id;
        const paymentLink = `https://sandbox.cashfree.com/pg/pay/${sessionId}`;

        res.json({
            orderId: response.data.order_id,
            orderStatus: response.data.order_status,
            paymentLink: paymentLink
        });

    } catch (error) {
        console.error("❌ Cashfree Order Error:", error.response ? error.response.data : error.message);
        res.status(500).json({
            message: "Error creating order",
            error: error.response ? error.response.data : error.message
        });
    }
});

// ✅ Export the router
module.exports = router;
