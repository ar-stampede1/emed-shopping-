require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JSON Web Token
const User = require('./models/User'); // Import the User model
const Product = require('./models/Product'); // Import the Product model
const app = express(); // ✅ Move 'app' declaration before using routes
const productRoutes = require('./routes/productRoutes'); // Import product routes
const paymentRoutes = require('./routes/paymentRoutes'); // Import payment routes
const stockRoutes = require('./routes/stockRoutes'); //import stock routes

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use the product routes
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes); // ✅ Register payment routes correctly
app.use('/api/stocks', stockRoutes);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach the decoded user data to the request object
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

app.get('/api/test', (req, res) => {
    res.send('Test endpoint is working!');
});

// Test Route
app.get('/', (req, res) => {
    res.send('E-medicine Shopping Site Backend is running!');
});

// Register User Route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user in the database
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                error: error.message // Cleaner error message
            });
        }

        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and assign a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Profile Route
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Logs the error stack trace to the console
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err // Show detailed errors only in non-production environments
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
