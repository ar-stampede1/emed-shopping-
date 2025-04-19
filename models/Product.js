const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, default: null }, // Default to null if no image provided
    createdAt: { type: Date, default: Date.now }
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

// Export the Product model
module.exports = Product;

