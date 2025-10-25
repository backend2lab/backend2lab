# Module 10 Exercise: File Upload with Multiple Files Support

## Objective
Create a comprehensive file upload API that accepts both single and multiple image files, with proper validation and error handling.

## What You'll Build
A robust API with multiple endpoints that:
- Accepts single image file uploads
- Accepts multiple image file uploads
- Validates file types and sizes
- Saves files to an `uploads` folder
- Serves uploaded files
- Returns detailed file information

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir file-upload-app
   cd file-upload-app
   npm init -y
   ```

2. **Install dependencies**:
   ```bash
   npm install express multer
   ```

3. **Create project structure**:
   ```
   file-upload-app/
   ├── server.js
   ├── uploads/          (create this folder)
   └── package.json
   ```

4. **Create uploads folder**:
   ```bash
   mkdir uploads
   ```

## Your Task

Create `server.js` and implement the following endpoints:

### 1. Single File Upload Endpoint
```javascript
// POST /upload-single
// Accepts a single image file with field name 'image'
// Returns file information or error
```

### 2. Multiple Files Upload Endpoint
```javascript
// POST /upload-multiple
// Accepts multiple image files with field name 'images'
// Maximum 5 files
// Returns array of file information
```

### 3. Mixed Files Upload Endpoint
```javascript
// POST /upload-mixed
// Accepts both avatar (single) and gallery (multiple) files
// Returns structured response with both file types
```

### 4. File Serving
```javascript
// GET /uploads/:filename
// Serves uploaded files
```

## Implementation Requirements

### Multer Configuration
```javascript
const multer = require('multer');
const path = require('path');

// TODO: Configure multer with:
// - Custom storage destination: 'uploads/'
// - Custom filename generation: timestamp + original extension
// - File type validation: only images (jpeg, png, gif, webp)
// - File size limit: 2MB per file
// - Maximum 5 files for multiple uploads

const storage = // Your storage configuration here
const upload = // Your multer configuration here
```

### Single File Upload
```javascript
app.post('/upload-single', /* your middleware here */, (req, res) => {
    // TODO: Handle single file upload
    // - Check if file exists
    // - Return file information or error
    // - Status codes: 200 for success, 400 for no file, 413 for too large
});
```

### Multiple Files Upload
```javascript
app.post('/upload-multiple', /* your middleware here */, (req, res) => {
    // TODO: Handle multiple files upload
    // - Check if files exist
    // - Return array of file information
    // - Handle partial uploads (some files fail)
});
```

### Mixed Files Upload
```javascript
app.post('/upload-mixed', /* your middleware here */, (req, res) => {
    // TODO: Handle mixed upload (avatar + gallery)
    // - Avatar: single file, field name 'avatar'
    // - Gallery: multiple files, field name 'gallery', max 3 files
    // - Return structured response
});
```

### File Serving
```javascript
// TODO: Serve uploaded files
// Use express.static or create custom route
```

### Error Handling
```javascript
// TODO: Add global error handler for multer errors
// Handle: LIMIT_FILE_SIZE, LIMIT_FILE_COUNT, etc.
```

## Step-by-Step Guide

1. **Set up basic Express server**:
   ```javascript
   const express = require('express');
   const app = express();
   const PORT = 3000;
   ```

2. **Configure multer storage**:
   ```javascript
   const storage = multer.diskStorage({
       destination: 'uploads/',
       filename: (req, file, cb) => {
           const uniqueName = Date.now() + path.extname(file.originalname);
           cb(null, uniqueName);
       }
   });
   ```

3. **Configure multer with validation**:
   ```javascript
   const upload = multer({
       storage: storage,
       limits: { 
           fileSize: 1024 * 1024 * 2, // 2MB
           files: 5 // Max 5 files
       },
       fileFilter: (req, file, cb) => {
           const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
           if (allowedTypes.includes(file.mimetype)) {
               cb(null, true);
           } else {
               cb(new Error('Only image files are allowed!'), false);
           }
       }
   });
   ```

4. **Create upload middlewares**:
   ```javascript
   const uploadSingle = upload.single('image');
   const uploadMultiple = upload.array('images', 5);
   const uploadMixed = upload.fields([
       { name: 'avatar', maxCount: 1 },
       { name: 'gallery', maxCount: 3 }
   ]);
   ```

5. **Implement endpoints** with proper error handling

6. **Add file serving** and global error handler

## Testing Your API

### Using curl for single file:
```bash
curl -X POST -F "image=@your-image.jpg" http://localhost:3000/upload-single
```

### Using curl for multiple files:
```bash
curl -X POST -F "images=@image1.jpg" -F "images=@image2.jpg" http://localhost:3000/upload-multiple
```

### Using curl for mixed upload:
```bash
curl -X POST -F "avatar=@avatar.jpg" -F "gallery=@gallery1.jpg" -F "gallery=@gallery2.jpg" http://localhost:3000/upload-mixed
```

### HTML Test Form:
```html
<!DOCTYPE html>
<html>
<body>
    <h2>Single File Upload</h2>
    <form action="http://localhost:3000/upload-single" method="POST" enctype="multipart/form-data">
        <input type="file" name="image" accept="image/*" required>
        <button type="submit">Upload Single</button>
    </form>

    <h2>Multiple Files Upload</h2>
    <form action="http://localhost:3000/upload-multiple" method="POST" enctype="multipart/form-data">
        <input type="file" name="images" accept="image/*" multiple required>
        <button type="submit">Upload Multiple</button>
    </form>

    <h2>Mixed Upload</h2>
    <form action="http://localhost:3000/upload-mixed" method="POST" enctype="multipart/form-data">
        <label>Avatar: <input type="file" name="avatar" accept="image/*"></label><br>
        <label>Gallery: <input type="file" name="gallery" accept="image/*" multiple></label><br>
        <button type="submit">Upload Mixed</button>
    </form>
</body>
</html>
```

## Expected Responses

### Single Upload Success:
```json
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "1703123456789.jpg",
    "originalName": "photo.jpg",
    "mimetype": "image/jpeg",
    "size": 15623,
    "url": "/uploads/1703123456789.jpg"
  }
}
```

### Multiple Upload Success:
```json
{
  "message": "Files uploaded successfully",
  "count": 3,
  "files": [
    {
      "filename": "1703123456789.jpg",
      "originalName": "photo1.jpg",
      "mimetype": "image/jpeg",
      "size": 15623,
      "url": "/uploads/1703123456789.jpg"
    },
    {
      "filename": "1703123456790.png",
      "originalName": "photo2.png",
      "mimetype": "image/png",
      "size": 23456,
      "url": "/uploads/1703123456790.png"
    }
  ]
}
```

### Mixed Upload Success:
```json
{
  "message": "Files uploaded successfully",
  "avatar": {
    "filename": "1703123456789.jpg",
    "originalName": "avatar.jpg",
    "mimetype": "image/jpeg",
    "size": 15623,
    "url": "/uploads/1703123456789.jpg"
  },
  "gallery": [
    {
      "filename": "1703123456790.png",
      "originalName": "gallery1.png",
      "mimetype": "image/png",
      "size": 23456,
      "url": "/uploads/1703123456790.png"
    }
  ]
}
```

### Error Responses:
```json
{
  "error": "No file uploaded"
}
```

```json
{
  "error": "File too large. Maximum size is 2MB"
}
```

```json
{
  "error": "Only image files are allowed!"
}
```

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add file metadata**: Store additional information like upload date, user ID
2. **Image processing**: Resize images using sharp library
3. **Cloud storage**: Upload to AWS S3 or similar service
4. **Progress tracking**: Add upload progress for large files
5. **File management**: Add delete and list endpoints

## What You'll Learn

- ✅ Installing and configuring Multer middleware
- ✅ Handling single and multiple file uploads
- ✅ Implementing file type and size validation
- ✅ Creating custom storage configurations
- ✅ Building comprehensive error handling
- ✅ Serving uploaded files
- ✅ Working with different upload patterns
- ✅ Security best practices for file uploads

## Troubleshooting

**"Cannot read property 'file' of undefined"?**
- Make sure you're using the correct middleware
- Check that your form field names match the middleware configuration

**Files not being saved?**
- Ensure the `uploads` folder exists
- Check folder permissions
- Verify storage configuration

**"Multer not found" error?**
- Install multer: `npm install multer`
- Check your require statement

**File type validation not working?**
- Verify the fileFilter function
- Check the mimetype values
- Test with different file types
