const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/File');

// Use memory storage to get buffer
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const filetypes = /pdf|jpg|jpeg|png/; // Extended to include images as per frontend needs
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: PDFs and Images Only!');
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @route   POST /api/upload
// @desc    Upload a file to MongoDB (GridFS approach simplified to single doc)
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const newFile = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer
        });

        const savedFile = await newFile.save();

        // Return a relative path that points to our own API to serve this file
        const fileUrl = `/api/upload/file/${savedFile._id}`;

        res.send({
            message: 'File uploaded to Database',
            filePath: fileUrl,
            fileId: savedFile._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error during upload');
    }
});

// @route   GET /api/upload/file/:id
// @desc    Serve a file from MongoDB
router.get('/file/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `inline; filename="${file.filename}"`); // inline to view in browser
        res.send(file.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
