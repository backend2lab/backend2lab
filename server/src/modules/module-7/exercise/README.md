# Module 7 Exercise: User Data Storage API

## Objective
Create a REST API with data persistence using JSON files, demonstrating the transition from in-memory to persistent storage through HTTP endpoints.

## What You'll Build
A complete REST API that:
- Saves user data to a JSON file
- Loads user data from the JSON file
- Handles missing files gracefully
- Provides full CRUD operations via HTTP endpoints

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

## Your Task

Complete the data storage functions in `server.js`:

```javascript
// TODO: Create a function to save users to JSON file
// The function should:
// - Take users array as parameter
// - Use fs.writeFileSync to save to DATA_FILE
// - Convert array to JSON string with JSON.stringify
// - Add error handling with try/catch
// - Return true on success, false on error

function saveUsers(users) {
    // Your code here
}

// TODO: Create a function to load users from JSON file
// The function should:
// - Read the file with fs.readFileSync
// - Parse JSON string back to array with JSON.parse  
// - Return empty array if file doesn't exist
// - Add error handling with try/catch

function loadUsers() {
    // Your code here
}
```

## API Endpoints

Once you complete the functions, your API will support these endpoints:

### GET /users
- Returns all users
- Response: Array of user objects

### POST /users
- Creates a new user
- Body: `{ "name": "string", "email": "string", "age": number (optional) }`
- Response: Created user object with ID

### GET /users/:id
- Returns a specific user by ID
- Response: User object or 404 if not found

### PUT /users/:id
- Updates a specific user by ID
- Body: `{ "name": "string", "email": "string", "age": number (optional) }`
- Response: Updated user object or 404 if not found

### DELETE /users/:id
- Deletes a specific user by ID
- Response: Success message or 404 if not found

## Step-by-Step Guide

### For `saveUsers` function:
1. Use `try/catch` block for error handling
2. Inside try: use `fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2))`
3. Return `true` on success
4. In catch: log the error and return `false`

### For `loadUsers` function:
1. Use `try/catch` block for error handling
2. Inside try: read file with `fs.readFileSync(DATA_FILE, 'utf8')`
3. Parse the data with `JSON.parse(data)` and return it
4. In catch: return empty array `[]`

## Testing Your API

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Test with curl or Postman**:

   ```bash
   # Get all users (empty initially)
   curl http://localhost:3000/users

   # Create a user
   curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'

   # Get all users (should show the created user)
   curl http://localhost:3000/users

   # Get specific user (replace USER_ID with actual ID)
   curl http://localhost:3000/users/USER_ID

   # Update user
   curl -X PUT http://localhost:3000/users/USER_ID \
     -H "Content-Type: application/json" \
     -d '{"name": "John Smith", "age": 31}'

   # Delete user
   curl -X DELETE http://localhost:3000/users/USER_ID
   ```

3. **Run automated tests**:
   ```bash
   npm test
   ```

## Expected Behavior

- Data persists between server restarts
- File `users.json` is created automatically
- All CRUD operations work correctly
- Proper error handling for missing files
- Validation for required fields (name, email)

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add data validation**: Validate email format, age range, etc.
2. **Add search functionality**: Create `GET /users?search=name` endpoint
3. **Add pagination**: Implement `GET /users?page=1&limit=10`
4. **Add sorting**: Implement `GET /users?sort=name&order=asc`
5. **Async versions**: Use `fs.promises` instead of sync functions

## What You Learned

- ✅ Converting in-memory data to file-based persistence
- ✅ Writing data to JSON files with `fs.writeFileSync`
- ✅ Reading data from JSON files with `fs.readFileSync`
- ✅ JSON serialization and deserialization
- ✅ Error handling for file operations
- ✅ Creating REST API endpoints with Express
- ✅ Implementing full CRUD operations
- ✅ Separating data layer from API routes

## Troubleshooting

**"ENOENT" error?**
- The file doesn't exist - that's normal for first run
- Your `loadUsers` function should handle this

**JSON parse error?**
- Check `users.json` for syntax errors
- Make sure JSON is valid (use a JSON validator)

**Permission denied?**
- Make sure you have write permissions in the directory
- Try running from a different folder

**Port already in use?**
- Change the PORT constant in server.js
- Or kill the process using port 3000
