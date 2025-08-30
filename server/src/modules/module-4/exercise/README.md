# Module 4 Exercise: Simple Books API

## Objective
Create a simple RESTful API for managing books using Express.js that follows REST conventions.

## What You'll Build
A books API that can:
- Get all books (GET)
- Get a single book (GET)
- Add a new book (POST)
- Update a book (PUT)
- Delete a book (DELETE)

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir books-api
   cd books-api
   npm init -y
   npm install express
   ```

2. **Create this file**:
   ```
   books-api/
   └── server.js
   ```

## Your Task

Create `server.js` and complete the REST endpoints:

```javascript
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
    console.log(`Books API running on http://localhost:${PORT}`);
});
```

## Implementation Hints

### GET all books
- Return the entire `books` array
- Use `res.json(books)`

### GET single book
- Use `req.params.id` to get the ID
- Use `books.find()` to locate the book
- Return 404 if not found

### POST new book
- Get `title` and `author` from `req.body`
- Create new book with unique ID (use `Date.now()`)
- Add to books array
- Return 201 status with new book

### PUT update book
- Find book by ID
- Update `title` and `author` if provided
- Return updated book or 404 if not found

### DELETE book
- Find book index with `books.findIndex()`
- Remove with `books.splice()`
- Return 204 status (no content)

## Testing Your API

**Start your server**:
```bash
node server.js
```

**Test with browser** (GET only):
- `http://localhost:3000/books`
- `http://localhost:3000/books/1`

**Test with curl** (all methods):
```bash
# Get all books
curl http://localhost:3000/books

# Get single book
curl http://localhost:3000/books/1

# Add new book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","author":"George Orwell"}'

# Update book
curl -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby - Updated"}'

# Delete book
curl -X DELETE http://localhost:3000/books/1
```

## Expected Responses

**GET /books**:
```json
[
    { "id": 1, "title": "The Great Gatsby", "author": "F. Scott Fitzgerald" },
    { "id": 2, "title": "To Kill a Mockingbird", "author": "Harper Lee" }
]
```

**POST /books** (Status: 201):
```json
{ "id": 1693234567890, "title": "1984", "author": "George Orwell" }
```

**GET /books/999** (Status: 404):
```json
{ "error": "Book not found" }
```

## What You Learned

- ✅ RESTful URL design patterns
- ✅ Using HTTP methods correctly
- ✅ Returning appropriate status codes
- ✅ Handling request parameters and body
- ✅ JSON request/response handling
- ✅ Error handling in REST APIs

## Troubleshooting

**JSON parsing errors?**
- Make sure to include `Content-Type: application/json` header
- Check your JSON syntax is valid

**404 errors for valid IDs?**
- Remember to convert `req.params.id` to integer with `parseInt()`

**Can't test POST/PUT/DELETE?**
- Use Postman, curl, or a REST client
- Browsers can only make GET requests directly
