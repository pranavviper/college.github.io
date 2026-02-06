const mongoose = require('mongoose');

const odRequestSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reason: {
        type: String, // 'Medical', 'Event', 'Personal'
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    proofFile: {
        type: String // URL/Path to file
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

const ODRequest = mongoose.model('ODRequest', odRequestSchema);

module.exports = ODRequest;
