const express = require('express');
const router = express.Router();
const {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    generatePDF,
    updateApplication,
    deleteApplication
} = require('../controllers/applicationController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createApplication)
    .get(protect, getApplications);

router.route('/:id')
    .get(protect, getApplicationById)
    .put(protect, updateApplication)
    .delete(protect, deleteApplication);

router.route('/:id/status')
    .put(protect, faculty, updateApplicationStatus);

router.route('/:id/pdf')
    .get(protect, generatePDF);

module.exports = router;
