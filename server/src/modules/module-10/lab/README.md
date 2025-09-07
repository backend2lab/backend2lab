# Module 10: File Uploads and Handling

## What is File Upload?

File upload allows users to send files from their device to your server. Common use cases include:
- Profile pictures
- Document uploads
- Image galleries
- File sharing

## How File Uploads Work

1. **Client** selects a file using HTML form
2. **Browser** sends file data in HTTP request
3. **Server** receives and processes the file
4. **Server** saves file to disk or cloud storage
5. **Server** responds with success/error status

## Multipart Form Data

File uploads use a special content type called `multipart/form-data`:

```html
<form method="POST" enctype="multipart/form-data">
    <input type="file" name="avatar" />
    <button type="submit">Upload</button>
</form>
```

The `enctype="multipart/form-data"` is crucial for file uploads.

## Multer Middleware

Multer is the most popular Express.js middleware for handling file uploads:

```bash
npm install multer
```

```javascript
const multer = require('multer');
const express = require('express');

const app = express();

// Basic multer setup
const upload = multer({ dest: 'uploads/' });

// Single file upload
app.post('/upload', upload.single('avatar'), (req, res) => {
    console.log(req.file); // File information
    res.json({ message: 'File uploaded successfully' });
});
```

## File Object Properties

When a file is uploaded, `req.file` contains:

```javascript
{
    fieldname: 'avatar',           // Form field name
    originalname: 'photo.jpg',     // Original file name
    mimetype: 'image/jpeg',        // File type
    size: 15623,                   // File size in bytes
    destination: 'uploads/',       // Where file is saved
    filename: '1a2b3c4d5e.jpg',   // Generated filename
    path: 'uploads/1a2b3c4d5e.jpg' // Full file path
}
```

## Storage Configuration

Configure where and how files are saved:

```javascript
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Save to uploads folder
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });
```

## File Type Validation

Restrict which file types can be uploaded:

```javascript
const fileFilter = (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    dest: 'uploads/',
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});
```

## Multiple File Uploads

Handle multiple files at once:

```javascript
// Multiple files with same field name
app.post('/upload-multiple', upload.array('photos', 5), (req, res) => {
    console.log(req.files); // Array of file objects
    res.json({ count: req.files.length });
});

// Multiple files with different field names
app.post('/upload-fields', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 8 }
]), (req, res) => {
    console.log(req.files.avatar); // Avatar file
    console.log(req.files.gallery); // Gallery files array
});
```

## File Serving

Serve uploaded files back to users:

```javascript
const path = require('path');

// Serve static files
app.use('/uploads', express.static('uploads'));

// Or create a specific route
app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    res.sendFile(filePath);
});
```

## Error Handling

Handle upload errors gracefully:

```javascript
app.post('/upload', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({ 
        message: 'File uploaded successfully',
        filename: req.file.filename 
    });
});

// Global error handler for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    
    res.status(500).json({ error: error.message });
});
```

## Complete Upload Example

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configure storage
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Configure multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Upload route
app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
        message: 'File uploaded successfully',
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        }
    });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.listen(3000);
```

## Security Considerations

- **File size limits**: Prevent large file uploads
- **File type validation**: Only allow expected file types
- **Filename sanitization**: Prevent path traversal attacks
- **Virus scanning**: Scan uploaded files for malware
- **Storage location**: Store files outside web root when possible

## Key Takeaways

- Use Multer middleware for file uploads in Express
- Configure storage destination and filename generation
- Validate file types and sizes for security
- Handle upload errors appropriately
- Serve uploaded files through static middleware or custom routes
- Always implement proper security measures
