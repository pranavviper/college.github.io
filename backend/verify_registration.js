const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

const verifyRegistration = async () => {
    try {
        await connectDB();

        const testUser = {
            name: 'Test Student',
            email: 'test.student@rajalakshmi.edu.in',
            password: 'password123',
            role: 'student',
            department: 'CSE',
            registerNumber: '12345678'
        };

        // Cleanup existing test user
        await User.deleteOne({ email: testUser.email });

        // Simulate Controller Logic (Directly creating user as controller would)
        const user = await User.create(testUser);
        console.log('User registered successfully:', user.email);

        // Verify in DB
        const foundUser = await User.findOne({ email: testUser.email });
        if (foundUser) {
            console.log('Verification: User found in DB.');
        } else {
            console.error('Verification Failed: User not found in DB.');
        }

        await mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Verification Error:', error.message);
        process.exit(1);
    }
};

verifyRegistration();
