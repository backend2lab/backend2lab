# Module 9: Pagination and Filtering

## What is Pagination?

Pagination is the process of dividing large datasets into smaller, manageable chunks (pages). Instead of returning 10,000 users at once, you return 20 users per page.

## What is Filtering?

Filtering allows users to search and narrow down results based on specific criteria. It's essential for helping users find exactly what they're looking for in large datasets.

## Why Use Pagination and Filtering?

- **Performance**: Faster response times and reduced memory usage
- **User Experience**: Easier to navigate and find specific data
- **Bandwidth**: Smaller data transfers
- **Scalability**: Handle large datasets efficiently
- **Searchability**: Allow users to find specific information quickly

## Pagination Concepts

### Key Terms

- **Page**: Current page number (usually starts at 1)
- **Limit/Size**: Number of items per page
- **Offset/Skip**: Number of items to skip
- **Total**: Total number of items in database

### Basic Formula

```javascript
const offset = (page - 1) * limit;

// Example: Page 3 with 10 items per page
// offset = (3 - 1) * 10 = 20 (skip first 20 items)
```

## Query Parameters for Pagination and Filtering

Standard pagination and filtering use these query parameters:

```
GET /api/users?page=2&limit=10
GET /api/users?search=john&role=admin&status=active
GET /api/users?page=1&limit=5&search=alice&role=user
GET /api/products?page=1&size=20&category=electronics&minPrice=100
```

## Basic Pagination Implementation

```javascript
app.get('/api/users', (req, res) => {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Simulate database query
    const allUsers = getUsersFromDatabase();
    const users = allUsers.slice(offset, offset + limit);
    
    // Calculate pagination info
    const totalUsers = allUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    
    res.json({
        data: users,
        pagination: {
            page: page,
            limit: limit,
            total: totalUsers,
            totalPages: totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    });
});
```

## What is Filtering?

Filtering allows users to search and narrow down results based on specific criteria.

## Common Filter Types

### Text Search
```javascript
// Search by name
GET /api/users?search=john

// Search in specific field
GET /api/users?name=john
```

### Exact Match
```javascript
// Filter by status
GET /api/orders?status=completed

// Filter by category
GET /api/products?category=electronics
```

### Range Filters
```javascript
// Price range
GET /api/products?minPrice=10&maxPrice=100

// Date range
GET /api/orders?startDate=2024-01-01&endDate=2024-12-31
```

## Basic Filtering Implementation

```javascript
app.get('/api/products', (req, res) => {
    let products = getAllProducts();
    
    // Filter by category
    if (req.query.category) {
        products = products.filter(p => 
            p.category.toLowerCase() === req.query.category.toLowerCase()
        );
    }
    
    // Filter by price range
    if (req.query.minPrice) {
        products = products.filter(p => p.price >= parseFloat(req.query.minPrice));
    }
    
    if (req.query.maxPrice) {
        products = products.filter(p => p.price <= parseFloat(req.query.maxPrice));
    }
    
    // Text search in name or description
    if (req.query.search) {
        const searchTerm = req.query.search.toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    res.json({ data: products, total: products.length });
});
```

## Combining Pagination and Filtering

```javascript
app.get('/api/products', (req, res) => {
    let products = getAllProducts();
    
    // Apply filters first
    if (req.query.category) {
        products = products.filter(p => 
            p.category.toLowerCase() === req.query.category.toLowerCase()
        );
    }
    
    if (req.query.search) {
        const searchTerm = req.query.search.toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Get total after filtering
    const totalFiltered = products.length;
    
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const paginatedProducts = products.slice(offset, offset + limit);
    
    res.json({
        data: paginatedProducts,
        pagination: {
            page: page,
            limit: limit,
            total: totalFiltered,
            totalPages: Math.ceil(totalFiltered / limit),
            hasNext: page < Math.ceil(totalFiltered / limit),
            hasPrev: page > 1
        },
        filters: {
            category: req.query.category || null,
            search: req.query.search || null
        }
    });
});
```

## Sorting Data

Often combined with pagination and filtering:

```javascript
app.get('/api/products', (req, res) => {
    let products = getAllProducts();
    
    // Apply filters...
    
    // Apply sorting
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
    
    products.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        // Handle strings
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
    
    // Apply pagination...
    
    res.json({
        data: paginatedProducts,
        pagination: { /* ... */ },
        sorting: {
            sortBy: sortBy,
            sortOrder: sortOrder
        }
    });
});
```

## Input Validation

Always validate and sanitize query parameters:

```javascript
function validatePaginationParams(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Limit the maximum page size
    const maxLimit = 100;
    const validLimit = limit > maxLimit ? maxLimit : limit;
    
    // Ensure positive numbers
    const validPage = page < 1 ? 1 : page;
    
    return { page: validPage, limit: validLimit };
}
```

## Database Considerations

For real databases, use database-specific pagination:

```javascript
// MongoDB example
const users = await User.find(filters)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

// SQL example
const users = await User.findAll({
    where: filters,
    offset: (page - 1) * limit,
    limit: limit,
    order: [['createdAt', 'DESC']]
});
```

## API Response Format

Standard response structure:

```json
{
    "data": [...],
    "pagination": {
        "page": 2,
        "limit": 10,
        "total": 156,
        "totalPages": 16,
        "hasNext": true,
        "hasPrev": true
    },
    "filters": {
        "category": "electronics",
        "search": "phone"
    },
    "sorting": {
        "sortBy": "price",
        "sortOrder": "asc"
    }
}
```

## Key Takeaways

- **Pagination** improves performance and user experience by breaking large datasets into manageable chunks
- **Filtering** helps users find specific data quickly and efficiently
- **Always apply filters before pagination** to ensure accurate results
- **Validate and limit query parameters** to prevent abuse and ensure data integrity
- **Use database-level pagination** for better performance with large datasets
- **Provide clear metadata** in responses (pagination info, applied filters)
- **Consider sorting** alongside pagination and filtering for better user experience
- **Test edge cases** like empty results, invalid parameters, and boundary conditions
- **Design consistent API responses** that include data, pagination, and filter information
