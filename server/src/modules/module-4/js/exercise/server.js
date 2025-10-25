const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sample data (in-memory storage)
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// TODO: GET /books - Return all books
app.get('/books', (req, res) => {
    // Your code here
});

// TODO: GET /books/:id - Return single book by ID
app.get('/books/:id', (req, res) => {
    // Your code here
    // Remember to handle "book not found" case
});

// TODO: POST /books - Create a new book
app.post('/books', (req, res) => {
    // Your code here
    // Create new book with: id, title, author from req.body
    // Return status 201 and the new book
});

// TODO: PUT /books/:id - Update existing book
app.put('/books/:id', (req, res) => {
    // Your code here
    // Find book, update title/author, return updated book
    // Handle "book not found" case
});

// TODO: DELETE /books/:id - Delete a book
app.delete('/books/:id', (req, res) => {
    // Your code here
    // Remove book from array, return status 204
    // Handle "book not found" case
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
