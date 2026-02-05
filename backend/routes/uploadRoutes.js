const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Use memory storage to get buffer
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 }, // 4MB limit for Vercel Serverless
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @route   POST /api/upload
// @desc    Upload a PDF file to Cloudinary
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const uploadFromBuffer = (buffer) => {
            return new Promise((resolve, reject) => {
                let cld_upload_stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'college_applications',
                        resource_type: 'raw', // 'raw' is best for PDFs to prevent auto-conversion/manipulation
                        public_id: `${req.file.fieldname}-${Date.now()}`
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(buffer).pipe(cld_upload_stream);
            });
        };

        const result = await uploadFromBuffer(req.file.buffer);

        res.send({
            message: 'File uploaded',
            filePath: result.secure_url, // Return the Cloudinary URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error during upload');
    }
});

module.exports = router;
