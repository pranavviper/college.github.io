const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all events
// @route   GET /api/events
// @access  Public (or Private)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Faculty/Admin)
router.post('/', protect, async (req, res) => {
    try {
        const { title, date, time, location, description, category, registrationLimit } = req.body;

        const event = new Event({
            title, date, time, location, description, category,
            registrationLimit: registrationLimit || 0,
            createdBy: req.user._id
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private (Student)
router.post('/:id/register', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already registered
        if (event.registeredStudents.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        // Check limit
        if (event.registrationLimit > 0 && event.registeredStudents.length >= event.registrationLimit) {
            return res.status(400).json({ message: 'Registration full' });
        }

        event.registeredStudents.push(req.user._id);
        await event.save();

        res.json({ message: 'Registered successfully', registeredStudents: event.registeredStudents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin/Faculty)
router.delete('/:id', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
