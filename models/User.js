const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'], // Email validation regex
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default to current date
    },
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
