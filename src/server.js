const express = require('express');
const app = express();

// Middleware for parsing JSON
app.use(express.json());

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET - Retrieve all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET - Retrieve a specific user
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});




app.listen(8080, () => {
    console.log('REST API server running on port 8080');
});