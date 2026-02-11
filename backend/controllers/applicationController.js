const Application = require('../models/Application');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Submit new application
// @route   POST /api/applications
// @access  Private (Student)
const createApplication = async (req, res) => {
    try {
        const {
            department,
            registerNumber,
            academicYear,
            batch,
            semester,
            cgpa,
            courses,
            internships
        } = req.body;

        const application = new Application({
            student: req.user._id,
            department,
            registerNumber,
            academicYear,
            batch,
            semester,
            cgpa,
            courses,
            internships,
            status: 'Pending'
        });

        const createdApplication = await application.save();
        res.status(201).json(createdApplication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Faculty/Admin for all, Student for own)
const getApplications = async (req, res) => {
    try {
        let applications;
        if (req.user.role === 'student') {
            applications = await Application.find({ student: req.user._id });
        } else {
            // Faculty/Admin see all. Can filter by query params if needed
            const keyword = req.query.keyword ? {
                department: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            } : {};
            applications = await Application.find({ ...keyword }).populate('student', 'name email registerNumber');
        }
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('student', 'name email registerNumber')
            .populate('faculty', 'name email');

        if (application) {
            res.json(application);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Faculty/Admin)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const application = await Application.findById(req.params.id);

        if (application) {
            application.status = status || application.status;
            application.remarks = remarks || application.remarks;
            application.faculty = req.user._id;

            const updatedApplication = await application.save();
            res.json(updatedApplication);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate PDF
// @route   GET /api/applications/:id/pdf
// @access  Private
const generatePDF = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('student', 'name registerNumber department');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.status !== 'Approved') {
            return res.status(400).json({ message: 'Application must be approved to generate PDF' });
        }

        const doc = new PDFDocument();
        const filename = `application-${application._id}.pdf`;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Ensure uploads directory exists
        if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
            fs.mkdirSync(path.join(__dirname, '../uploads'));
        }

        // Pipe to file
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Document content
        doc.fontSize(25).text('Credit Transfer Application Approved', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Student Name: ${application.student.name}`);
        doc.text(`Register Number: ${application.student.registerNumber}`);
        doc.text(`Department: ${application.department}`);
        doc.moveDown();
        doc.text('Approved Courses:');
        application.courses.forEach((course, i) => {
            doc.text(`${i + 1}. ${course.courseName} (${course.courseCode}) - ${course.credits} Credits`);
        });
        doc.moveDown();
        doc.text(`Total Credits: ${application.courses.reduce((acc, curr) => acc + curr.credits, 0)}`);
        doc.moveDown();
        doc.text(`Approved By: Faculty ID ${application.faculty}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);

        doc.end();

        writeStream.on('finish', () => {
            // Stream the file properly
            // Or just return the URL if serving statically
            // res.download(filePath);

            // Better to return the path if we are serving static files
            res.json({ pdfUrl: `/uploads/${filename}` });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application (for re-submission)
// @route   PUT /api/applications/:id
// @access  Private (Student only)
const updateApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        // Check if user owns the application
        if (application.student.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this application');
        }

        // Only allow update if status is Rejected (or maybe Pending if you want them to edit before approval)
        // Requirement says "student can edit if faculty reject application"
        if (application.status !== 'Rejected') {
            res.status(400);
            throw new Error('Can only edit rejected applications');
        }

        // Update fields
        application.academicYear = req.body.academicYear || application.academicYear;
        application.batch = req.body.batch || application.batch;
        application.semester = req.body.semester || application.semester;
        application.cgpa = req.body.cgpa || application.cgpa;
        application.courses = req.body.courses || application.courses;
        application.internships = req.body.internships || application.internships;

        // Reset status to Pending for re-evaluation
        application.status = 'Pending';
        // Clear previous remarks/rejections reasoning if needed, or keep history? 
        // For simple flow, maybe keep remarks so they know what was wrong, but status is now Pending.
        // Or clear remarks? Let's keep remarks for history but new status overrides.

        const updatedApplication = await application.save();
        res.json(updatedApplication);

    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode); // Preserve 404/401/400
        res.json({ message: error.message });
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Admin/Faculty)
const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (application) {
            await application.deleteOne();
            res.json({ message: 'Application removed' });
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    generatePDF,
    updateApplication,
    deleteApplication
};
