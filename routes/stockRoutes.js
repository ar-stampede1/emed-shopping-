const express = require('express');
const axios = require('axios');
const router = express.Router();

// 🔹 Flask API URL (Replace with the actual one from Teammate 2)
const flaskApiUrl = "http://127.0.0.1:5000/predict"; 

// ✅ API to Fetch Stock Predictions from Flask
router.get('/stock-prediction', async (req, res) => {
    try {
        const response = await axios.get(flaskApiUrl);
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching stock predictions:", error.message);
        res.status(500).json({ message: "Error fetching stock predictions" });
    }
});

module.exports = router;
