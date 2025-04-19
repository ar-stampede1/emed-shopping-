
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware to protect product routes (ensure path matches your project structure)
const authenticateToken = require('../middleware/authenticateToken');

// Protect all product routes
router.use(authenticateToken); // router.use(authenticateToken);


// Create a Product
router.post('/', async (req, res) => {
    console.log('Received request to create product:', req.body); // Debug log
    const { name, price, description, image } = req.body;

    try {
        const newProduct = new Product({
            name,
            price,
            description,
            image
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating product' });
    }
});

// Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving products' });
    }
});

// Get a Product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving product' });
    }
});

// Update a Product
router.put('/:id', async (req, res) => {
    const { name, price, description, image } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description, image },
            { new: true } // Return the updated product
        );
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating product' });
    }
});

// Delete a Product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting product' });
    }
});

module.exports = router;
