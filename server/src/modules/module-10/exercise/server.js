const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// TODO: Configure multer storage
// Create custom storage that saves files to 'uploads/' folder
// Generate unique filenames using timestamp + original extension

// TODO: Configure multer with validation
// - File type validation: only images (jpeg, png, gif, webp)
// - File size limit: 2MB per file
// - Maximum 5 files for multiple uploads

// TODO: Create upload middlewares
// - uploadSingle: for single file uploads
// - uploadMultiple: for multiple file uploads (max 5)
// - uploadMixed: for mixed uploads (avatar + gallery)

// TODO: Single file upload endpoint
// POST /upload-single
// Accepts single image file with field name 'image'
// Returns file information or error

// TODO: Multiple files upload endpoint
// POST /upload-multiple
// Accepts multiple image files with field name 'images'
// Maximum 5 files
// Returns array of file information

// TODO: Mixed files upload endpoint
// POST /upload-mixed
// Accepts both avatar (single) and gallery (multiple) files
// Avatar: single file, field name 'avatar'
// Gallery: multiple files, field name 'gallery', max 3 files
// Returns structured response

// TODO: File serving
// Serve uploaded files from /uploads directory
// Use express.static middleware

// TODO: Global error handler
// Handle multer errors (LIMIT_FILE_SIZE, LIMIT_FILE_COUNT, etc.)
// Return appropriate error messages and status codes

// TODO: Start server
// Listen on port 3000 with console.log message

// Basic server startup for testing (students need to implement the upload endpoints)
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
