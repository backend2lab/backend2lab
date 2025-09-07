const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sample data (in-memory storage)
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// GET /books - Return all books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET /books/:id - Return single book by ID
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
});

// POST /books - Create a new book
app.post('/books', (req, res) => {
    const newBook = {
        id: Date.now(),
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /books/:id - Update existing book
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    res.json(book);
});

// DELETE /books/:id - Delete a book
app.delete('/books/:id', (req, res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    books.splice(index, 1);
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
