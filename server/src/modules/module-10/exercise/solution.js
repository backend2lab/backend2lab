const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Configure multer with validation
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB limit
        files: 5 // Maximum 5 files
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Single file upload endpoint
app.post('/upload-single', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
        message: 'File uploaded successfully',
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`
        }
    });
});

// Multiple files upload endpoint
app.post('/upload-multiple', upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`
    }));

    res.json({
        message: 'Files uploaded successfully',
        count: files.length,
        files: files
    });
});

// Mixed files upload endpoint
app.post('/upload-mixed', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 3 }
]), (req, res) => {
    const response = {
        message: 'Files uploaded successfully'
    };

    // Handle avatar file
    if (req.files.avatar && req.files.avatar[0]) {
        const avatar = req.files.avatar[0];
        response.avatar = {
            filename: avatar.filename,
            originalName: avatar.originalname,
            mimetype: avatar.mimetype,
            size: avatar.size,
            url: `/uploads/${avatar.filename}`
        };
    }

    // Handle gallery files
    if (req.files.gallery && req.files.gallery.length > 0) {
        response.gallery = req.files.gallery.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`
        }));
    }

    // Check if at least one file was uploaded
    if (!response.avatar && (!response.gallery || response.gallery.length === 0)) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    res.json(response);
});

// File serving
app.use('/uploads', express.static(uploadsDir));

// Global error handler
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File too large. Maximum size is 2MB' });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(413).json({ error: 'Too many files uploaded' });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Unexpected file field' });
        }
        return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
