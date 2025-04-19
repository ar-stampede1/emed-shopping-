const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log('Auth middleware hit'); // Debug log
    // Get the token from the request header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        console.log('No auth header'); // Debug log
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        console.log('No token'); // Debug log
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token with the JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.log('Invalid token'); // Debug log
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticateToken;


