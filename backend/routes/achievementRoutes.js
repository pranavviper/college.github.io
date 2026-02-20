const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create new achievement
// @route   POST /api/achievements
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, type, date, description, proofFile } = req.body;

        const achievement = new Achievement({
            student: req.user._id,
            title, type, date, description, proofFile
        });

        const createdAchievement = await achievement.save();
        res.status(201).json(createdAchievement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get logged in user's achievements
// @route   GET /api/achievements/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const achievements = await Achievement.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all achievements (Highlights) - e.g. Verified ones
// @route   GET /api/achievements
// @access  Public/Private
router.get('/', async (req, res) => {
    try {
        // Fetch verified ones or specific department highlights (Mocking 'Verified' requirement for now or fetching all)
        const achievements = await Achievement.find({}).populate('student', 'name registerNumber department').sort({ createdAt: -1 });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update achievement status
// @route   PUT /api/achievements/:id/status
// @access  Private (Admin/Faculty)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        // Only allow Admin or Faculty to update status. Depending on requirements, we can enforce role checks here or in middleware.
        if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ message: 'Not authorized to update status' });
        }

        achievement.status = status;
        const updatedAchievement = await achievement.save();

        res.json(updatedAchievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
