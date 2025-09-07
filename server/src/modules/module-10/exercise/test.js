const { expect } = require('chai');
const request = require('supertest');
const fs = require('fs');
const path = require('path');

describe('File Upload Server', () => {
    const SERVER_URL = 'http://localhost:3000';

    after(() => {
        // Clean up test files
        cleanupTestFiles();
    });

    // Test utilities
    function createTestFile(filename, content = 'test content') {
        const testDir = path.join(__dirname, 'test-files');
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir);
        }
        
        const filePath = path.join(testDir, filename);
        fs.writeFileSync(filePath, content);
        return filePath;
    }

    function cleanupTestFiles() {
        const testDir = path.join(__dirname, 'test-files');
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
        
        const uploadsDir = path.join(__dirname, 'uploads');
        if (fs.existsSync(uploadsDir)) {
            fs.rmSync(uploadsDir, { recursive: true, force: true });
        }
    }

    describe('Single File Upload', () => {
        it('should handle successful single file upload', async () => {
            const testFile = createTestFile('test.jpg', 'fake image content');
            
            const response = await request(SERVER_URL)
                .post('/upload-single')
                .attach('image', testFile)
                .expect(200)
                .expect('Content-Type', /json/);
            
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('file');
            expect(response.body.file).to.have.property('filename');
            expect(response.body.file).to.have.property('originalName');
        });

        it('should handle no file upload error', async () => {
            const response = await request(SERVER_URL)
                .post('/upload-single')
                .expect(400)
                .expect('Content-Type', /json/);
            
            expect(response.body.error).to.include('No file');
        });
    });

    describe('Multiple Files Upload', () => {
        it('should handle successful multiple files upload', async () => {
            const testFile1 = createTestFile('test1.jpg', 'fake image content 1');
            const testFile2 = createTestFile('test2.png', 'fake image content 2');
            
            const response = await request(SERVER_URL)
                .post('/upload-multiple')
                .attach('images', testFile1)
                .attach('images', testFile2)
                .expect(200)
                .expect('Content-Type', /json/);
            
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('files');
            expect(response.body.files).to.be.an('array');
            expect(response.body.count).to.equal(2);
        });

        it('should handle no files upload error', async () => {
            const response = await request(SERVER_URL)
                .post('/upload-multiple')
                .expect(400)
                .expect('Content-Type', /json/);
            
            expect(response.body.error).to.include('No files');
        });
    });

    describe('Mixed Upload', () => {
        it('should handle successful mixed upload', async () => {
            const avatarFile = createTestFile('avatar.jpg', 'fake avatar content');
            const galleryFile1 = createTestFile('gallery1.jpg', 'fake gallery content 1');
            const galleryFile2 = createTestFile('gallery2.png', 'fake gallery content 2');
            
            const response = await request(SERVER_URL)
                .post('/upload-mixed')
                .attach('avatar', avatarFile)
                .attach('gallery', galleryFile1)
                .attach('gallery', galleryFile2)
                .expect(200)
                .expect('Content-Type', /json/);
            
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('avatar');
            expect(response.body).to.have.property('gallery');
            expect(response.body.gallery).to.be.an('array');
            expect(response.body.gallery).to.have.length(2);
        });
    });

    describe('File Serving', () => {
        it('should serve uploaded files', async () => {
            // First upload a file
            const testFile = createTestFile('serve-test.jpg', 'content to serve');
            
            const uploadResponse = await request(SERVER_URL)
                .post('/upload-single')
                .attach('image', testFile)
                .expect(200);
            
            const filename = uploadResponse.body.file.filename;
            
            // Now try to serve the file
            await request(SERVER_URL)
                .get(`/uploads/${filename}`)
                .expect(200);
        });
    });
});
