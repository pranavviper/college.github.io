const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

const clearUsers = async () => {
    try {
        await connectDB();

        console.log('Clearing all users...');
        const result = await User.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} users.`);

        await mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Error clearing users:', error.message);
        process.exit(1);
    }
};

clearUsers();
