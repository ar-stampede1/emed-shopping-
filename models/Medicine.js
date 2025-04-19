const mongoose = require('mongoose');

// Define the Medicine schema
const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Medicine name is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'], // Ensure price is non-negative
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    image: {
        type: String, // URL of the medicine image
        required: [true, 'Image URL is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default to current date
    },
});

// Create the Medicine model
const Medicine = mongoose.model('Medicine', medicineSchema);

// Export the Medicine model
module.exports = Medicine;

