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

// GET /api/users endpoint with pagination and filtering
app.get('/api/users', (req, res) => {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    
    // Get filtering parameters
    const search = req.query.search;
    const role = req.query.role;
    const status = req.query.status;
    
    // Apply filters first
    let filteredUsers = users;
    
    // Apply search filter (search in name and email)
    if (search) {
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Apply role filter
    if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    // Apply status filter
    if (status) {
        filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    // Calculate pagination after filtering
    const totalFiltered = filteredUsers.length;
    const offset = (page - 1) * limit;
    const pageUsers = filteredUsers.slice(offset, offset + limit);
    const totalPages = Math.ceil(totalFiltered / limit);
    
    // Return response with data, pagination, and filters
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
