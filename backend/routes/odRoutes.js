const express = require('express');
const router = express.Router();
const ODRequest = require('../models/ODRequest');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create new OD request
// @route   POST /api/od
// @access  Private (Student)
router.post('/', protect, async (req, res) => {
    try {
        const { reason, fromDate, toDate, description, proofFile } = req.body;

        const odRequest = new ODRequest({
            student: req.user._id,
            reason,
            fromDate,
            toDate,
            description,
            proofFile
        });

        const createdOD = await odRequest.save();
        res.status(201).json(createdOD);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get logged in user's OD requests
// @route   GET /api/od/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const ods = await ODRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(ods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all OD requests (Faculty/Admin)
// @route   GET /api/od
// @access  Private (Faculty)
router.get('/', protect, async (req, res) => {
    try {
        // ideally check role here
        const ods = await ODRequest.find({}).populate('student', 'name registerNumber department').sort({ createdAt: -1 });
        res.json(ods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update OD request status
// @route   PUT /api/od/:id/status
// @access  Private (Faculty/Admin)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const odRequest = await ODRequest.findById(req.params.id);

        if (odRequest) {
            odRequest.status = status;
            const updatedOD = await odRequest.save();
            res.json(updatedOD);
        } else {
            res.status(404).json({ message: 'OD Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete OD request
// @route   DELETE /api/od/:id
// @access  Private (Admin/Faculty)
router.delete('/:id', protect, async (req, res) => {
    try {
        const odRequest = await ODRequest.findById(req.params.id);

        if (odRequest) {
            await odRequest.deleteOne();
            res.json({ message: 'OD Request removed' });
        } else {
            res.status(404).json({ message: 'OD Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
