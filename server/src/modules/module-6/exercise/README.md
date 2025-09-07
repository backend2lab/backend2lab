# Module 6 Exercise: Pagination and Filtering

## Objective
Create an API endpoint that returns paginated and filtered results from a list of users.

## What You'll Build
An API endpoint that:
- Returns users in pages (e.g., 5 users per page)
- Accepts `page` and `limit` query parameters for pagination
- Accepts `search`, `role`, and `status` query parameters for filtering
- Returns pagination information and applied filters
- Combines filtering and pagination correctly

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir pagination-api
   cd pagination-api
   npm init -y
   npm install express
   ```

2. **Create this file**:
   ```
   pagination-api/
   └── server.js
   ```

## Sample Data

Use this array of users in your server:

```javascript
const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user", status: "active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "user", status: "inactive" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "moderator", status: "active" },
    { id: 5, name: "Edward Norton", email: "edward@example.com", role: "user", status: "active" },
    { id: 6, name: "Fiona Green", email: "fiona@example.com", role: "admin", status: "inactive" },
    { id: 7, name: "George Wilson", email: "george@example.com", role: "user", status: "active" },
    { id: 8, name: "Hannah Davis", email: "hannah@example.com", role: "moderator", status: "active" },
    { id: 9, name: "Ian Thompson", email: "ian@example.com", role: "user", status: "inactive" },
    { id: 10, name: "Julia Roberts", email: "julia@example.com", role: "admin", status: "active" },
    { id: 11, name: "Kevin Lee", email: "kevin@example.com", role: "user", status: "active" },
    { id: 12, name: "Lisa Wang", email: "lisa@example.com", role: "moderator", status: "inactive" },
    { id: 13, name: "Mike Johnson", email: "mike@example.com", role: "user", status: "active" },
    { id: 14, name: "Nancy Brown", email: "nancy@example.com", role: "admin", status: "active" },
    { id: 15, name: "Oliver Smith", email: "oliver@example.com", role: "user", status: "inactive" }
];
```

## Your Task

Create `server.js` and implement the pagination and filtering endpoint:

```javascript
const express = require('express');
const app = express();

// Enable JSON parsing
app.use(express.json());

const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user", status: "active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "user", status: "inactive" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "moderator", status: "active" },
    { id: 5, name: "Edward Norton", email: "edward@example.com", role: "user", status: "active" },
    { id: 6, name: "Fiona Green", email: "fiona@example.com", role: "admin", status: "inactive" },
    { id: 7, name: "George Wilson", email: "george@example.com", role: "user", status: "active" },
    { id: 8, name: "Hannah Davis", email: "hannah@example.com", role: "moderator", status: "active" },
    { id: 9, name: "Ian Thompson", email: "ian@example.com", role: "user", status: "inactive" },
    { id: 10, name: "Julia Roberts", email: "julia@example.com", role: "admin", status: "active" },
    { id: 11, name: "Kevin Lee", email: "kevin@example.com", role: "user", status: "active" },
    { id: 12, name: "Lisa Wang", email: "lisa@example.com", role: "moderator", status: "inactive" },
    { id: 13, name: "Mike Johnson", email: "mike@example.com", role: "user", status: "active" },
    { id: 14, name: "Nancy Brown", email: "nancy@example.com", role: "admin", status: "active" },
    { id: 15, name: "Oliver Smith", email: "oliver@example.com", role: "user", status: "inactive" }
];

// TODO: Create GET /api/users endpoint with pagination and filtering
app.get('/api/users', (req, res) => {
    // TODO: Get pagination parameters
    const page = // Your code here
    const limit = // Your code here
    
    // TODO: Get filtering parameters
    const search = // Your code here
    const role = // Your code here
    const status = // Your code here
    
    // TODO: Apply filters first
    let filteredUsers = users;
    
    // TODO: Apply search filter (search in name and email)
    if (search) {
        // Your code here
    }
    
    // TODO: Apply role filter
    if (role) {
        // Your code here
    }
    
    // TODO: Apply status filter
    if (status) {
        // Your code here
    }
    
    // TODO: Calculate pagination after filtering
    const totalFiltered = // Your code here
    const offset = // Your code here
    const pageUsers = // Your code here
    const totalPages = // Your code here
    
    // TODO: Return response with data, pagination, and filters
    res.json({
        data: pageUsers,
        pagination: {
            page: page,
            limit: limit,
            total: totalFiltered,
            totalPages: totalPages
        },
        filters: {
            search: search !== undefined ? search : null,
            role: role || null,
            status: status || null
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

## Step-by-Step Guide

1. **Get pagination parameters**:
   ```javascript
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 5;
   ```

2. **Get filtering parameters**:
   ```javascript
   const search = req.query.search;
   const role = req.query.role;
   const status = req.query.status;
   ```

3. **Apply filters**:
   ```javascript
   let filteredUsers = users;
   
   // Search filter
   if (search) {
       filteredUsers = filteredUsers.filter(user => 
           user.name.toLowerCase().includes(search.toLowerCase()) ||
           user.email.toLowerCase().includes(search.toLowerCase())
       );
   }
   
   // Role filter
   if (role) {
       filteredUsers = filteredUsers.filter(user => user.role === role);
   }
   
   // Status filter
   if (status) {
       filteredUsers = filteredUsers.filter(user => user.status === status);
   }
   ```

4. **Apply pagination to filtered results with validation**:
   ```javascript
   // Get pagination parameters with validation
   let page = parseInt(req.query.page, 10) || 1;
   let limit = parseInt(req.query.limit, 10) || 5;
   
   // Validate and sanitize pagination parameters
   if (isNaN(page) || page < 1) page = 1;
   if (isNaN(limit) || limit < 1) limit = 5;
   
   const MAX_LIMIT = 100;
   if (limit > MAX_LIMIT) limit = MAX_LIMIT;
   
   // Ensure integers
   page = Math.floor(page);
   limit = Math.floor(limit);
   
   // Calculate pagination after filtering
   const totalFiltered = filteredUsers.length;
   const totalPages = Math.ceil(totalFiltered / limit);
   
   // Check if page exists
   if (totalPages > 0 && page > totalPages) {
       return res.status(404).json({ error: 'Page not found' });
   }
   
   const startIndex = (page - 1) * limit;
   const endIndex = page * limit;
   const pageUsers = filteredUsers.slice(startIndex, endIndex);
   ```

## Testing Your API

1. **Start your server**:
   ```bash
   node server.js
   ```

2. **Test pagination**:
   - Page 1: `http://localhost:3000/api/users?page=1&limit=5`
   - Page 2: `http://localhost:3000/api/users?page=2&limit=5`
   - Page 3: `http://localhost:3000/api/users?page=3&limit=5`

3. **Test filtering**:
   - Search: `http://localhost:3000/api/users?search=alice`
   - Role filter: `http://localhost:3000/api/users?role=admin`
   - Status filter: `http://localhost:3000/api/users?status=active`

4. **Test combined filtering and pagination**:
   - `http://localhost:3000/api/users?role=user&status=active&page=1&limit=3`
   - `http://localhost:3000/api/users?search=john&page=1&limit=2`

## Expected Responses

**GET `/api/users?page=1&limit=5`**:
```json
{
    "data": [
        { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin", "status": "active" },
        { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "user", "status": "active" },
        { "id": 3, "name": "Charlie Brown", "email": "charlie@example.com", "role": "user", "status": "inactive" },
        { "id": 4, "name": "Diana Prince", "email": "diana@example.com", "role": "moderator", "status": "active" },
        { "id": 5, "name": "Edward Norton", "email": "edward@example.com", "role": "user", "status": "active" }
    ],
    "pagination": {
        "page": 1,
        "limit": 5,
        "total": 15,
        "totalPages": 3
    },
    "filters": {
        "search": null,
        "role": null,
        "status": null
    }
}
```

**GET `/api/users?role=admin&page=1&limit=3`**:
```json
{
    "data": [
        { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin", "status": "active" },
        { "id": 6, "name": "Fiona Green", "email": "fiona@example.com", "role": "admin", "status": "inactive" },
        { "id": 10, "name": "Julia Roberts", "email": "julia@example.com", "role": "admin", "status": "active" }
    ],
    "pagination": {
        "page": 1,
        "limit": 3,
        "total": 4,
        "totalPages": 2
    },
    "filters": {
        "search": null,
        "role": "admin",
        "status": null
    }
}
```

**GET `/api/users?search=john&page=1&limit=2`**:
```json
{
    "data": [
        { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin", "status": "active" },
        { "id": 13, "name": "Mike Johnson", "email": "mike@example.com", "role": "user", "status": "active" }
    ],
    "pagination": {
        "page": 1,
        "limit": 2,
        "total": 2,
        "totalPages": 1
    },
    "filters": {
        "search": "john",
        "role": null,
        "status": null
    }
}
```

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add navigation info**:
   ```javascript
   hasNext: page < totalPages,
   hasPrev: page > 1
   ```

2. **Add sorting**:
   ```javascript
   // Add sortBy and sortOrder parameters
   const sortBy = req.query.sortBy || 'id';
   const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
   
   // Sort filtered users before pagination
   filteredUsers.sort((a, b) => {
       let aVal = a[sortBy];
       let bVal = b[sortBy];
       
       if (typeof aVal === 'string') {
           aVal = aVal.toLowerCase();
           bVal = bVal.toLowerCase();
       }
       
       if (sortOrder === 'desc') {
           return bVal > aVal ? 1 : -1;
       } else {
           return aVal > bVal ? 1 : -1;
       }
   });
   ```

3. **Add comprehensive validation** (already implemented in solution):
   ```javascript
   // Validate and sanitize pagination parameters
   let page = parseInt(req.query.page, 10) || 1;
   let limit = parseInt(req.query.limit, 10) || 5;
   
   if (isNaN(page) || page < 1) page = 1;
   if (isNaN(limit) || limit < 1) limit = 5;
   
   const MAX_LIMIT = 100;
   if (limit > MAX_LIMIT) limit = MAX_LIMIT;
   
   page = Math.floor(page);
   limit = Math.floor(limit);
   
   // Validate role and status values
   const validRoles = ['admin', 'user', 'moderator'];
   const validStatuses = ['active', 'inactive'];
   
   if (role && !validRoles.includes(role)) {
       return res.status(400).json({ error: 'Invalid role' });
   }
   
   if (status && !validStatuses.includes(status)) {
       return res.status(400).json({ error: 'Invalid status' });
   }
   ```

4. **Handle page not found** (already implemented in solution):
   ```javascript
   if (totalPages > 0 && page > totalPages) {
       return res.status(404).json({ error: 'Page not found' });
   }
   ```

5. **Add case-insensitive role and status filtering**:
   ```javascript
   if (role) {
       filteredUsers = filteredUsers.filter(user => 
           user.role.toLowerCase() === role.toLowerCase()
       );
   }
   ```

## What You Learned

- ✅ Implementing pagination with `slice()`
- ✅ Processing query parameters for both pagination and filtering
- ✅ Applying multiple filters to data
- ✅ Combining filtering and pagination correctly
- ✅ Calculating offsets and page counts on filtered data
- ✅ Returning comprehensive metadata (pagination + filters)
- ✅ Testing paginated and filtered APIs
- ✅ Understanding the importance of applying filters before pagination

## Troubleshooting

**Getting all users instead of a page?**
- Check your `slice()` parameters
- Make sure `offset` is calculated correctly

**Page calculation wrong?**
- Remember: `Math.ceil()` for total pages
- Pages start at 1, not 0

**NaN in pagination?**
- Use `parseInt()` on query parameters
- Provide default values with `|| 1`
