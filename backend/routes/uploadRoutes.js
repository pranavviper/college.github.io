const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('PDFs only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Since we are running from root, destination 'backend/uploads/' might need adjustment depending on CWD of node process.
// But mostly relative path from where node is run.
// Wait, if server.js is in backend/, and we run `node server.js` from backend/, then 'uploads/' is enough.
// If we set destination to 'backend/uploads/' but run from backend/, it tries to find backend/backend/uploads/
// Better to use absolute path or relative to __dirname.

// Let's redefine storage with path.join
const uploadDir = path.join(__dirname, '../uploads');
// Ensure it exists?
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storageFixed = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const uploadFixed = multer({
    storage: storageFixed,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});


router.post('/', uploadFixed.single('file'), (req, res) => {
    res.send({
        message: 'File uploaded',
        filePath: `/uploads/${req.file.filename}`,
    });
});

module.exports = router;
