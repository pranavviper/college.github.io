
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@rajalakshmi.edu.in';
        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('Admin user found. Updating role...');
            user.role = 'admin';
            await user.save();
            console.log('Updated existing user to admin role');
        } else {
            console.log('Creating new admin user...');
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'adminpassword',
                role: 'admin',
                department: 'CSE'
            });
            console.log('Admin user created');
        }
        console.log('Done!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
