const mongoose = require('mongoose');

const achievementSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String, // 'Online Course', 'Internship', 'Project', etc.
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    proofFile: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending Verified', 'Verified', 'Rejected'], // 'Pending Verified' is default
        default: 'Pending Verified'
    }
}, {
    timestamps: true
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
