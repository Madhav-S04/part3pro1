const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());

// Custom Morgan token to log request body for POST requests
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''; // Only log body for POST
});

// Use Morgan with our custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

/**
 *  Get all persons
 *  Route: GET http://localhost:3001/api/persons
 */
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

/**
 *  Add a new person to the phonebook
 *  Route: POST http://localhost:3001/api/persons
 */
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    // Error: Missing name or number
    if (!name || !number) {
        return res.status(400).json({ error: 'Name and number are required' });
    }

    // Error: Name already exists
    if (persons.some(person => person.name === name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    // Generate a new unique ID
    const id = Math.floor(Math.random() * 1000000).toString();

    // Create new person object
    const newPerson = { id, name, number };
    persons = [...persons, newPerson];

    res.status(201).json(newPerson);
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
