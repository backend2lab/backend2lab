const express = require('express');
const app = express();

// Enable JSON parsing
app.use(express.json());

// Sample users data
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
// The endpoint should:
// - Accept 'page' and 'limit' query parameters for pagination
// - Accept 'search', 'role', and 'status' query parameters for filtering
// - Default to page=1 and limit=5 if not provided
// - Apply filters first, then pagination
// - Return response with data, pagination info, and applied filters

app.get('/api/users', (req, res) => {
    // TODO: Get filtering parameters
    const search = undefined; // Your code here
    const role = undefined; // Your code here
    const status = undefined; // Your code here
    
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
    
    // TODO: Get pagination parameters with validation
    let page = undefined; // Your code here
    let limit = undefined; // Your code here
    
    // TODO: Validate and sanitize pagination parameters
    // Check for NaN, negative values, and set defaults
    // Set maximum limit (e.g., 100)
    // Ensure integers with Math.floor()
    
    // TODO: Calculate pagination after filtering
    const totalFiltered = undefined; // Your code here
    const totalPages = undefined; // Your code here
    
    // TODO: Check if page exists (return 404 if page > totalPages)
    
    // TODO: Calculate start and end indices for slicing
    const startIndex = undefined; // Your code here
    const endIndex = undefined; // Your code here
    const pageUsers = undefined; // Your code here
    
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
