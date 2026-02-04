const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseType: { type: String, required: true }, // 1, 2, or 3 credit
    recSubjectCode: { type: String, required: true }, // Subject Code assigned by REC
    courseName: { type: String, required: true },
    offeringUniversity: { type: String, required: true },
    grade: { type: String, required: true },
    droppedElective: { type: String, required: true },
    droppedElectiveCode: { type: String, required: true },
    semester: { type: String, required: true },
    proofFile: { type: String, required: false } // Made optional for now or require it
});

const internshipSchema = mongoose.Schema({
    industrySubjectCode: { type: String, required: true },
    companyName: { type: String, required: true },
    duration: { type: String, required: true }, // Internship Period
    grade: { type: String, required: true },
    droppedElective: { type: String, required: true },
    semester: { type: String, required: true },
    proofFile: { type: String, required: false }
});

const applicationSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    department: {
        type: String,
        required: true
    },
    batch: { // New field
        type: String,
        required: true
    },
    registerNumber: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    semester: { // Current Semester of student
        type: String,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    courses: [courseSchema],
    internships: [internshipSchema],
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    remarks: {
        type: String
    },
    applicationPdf: {
        type: String
    }
}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
