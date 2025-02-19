const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

/**
 *  Root URL - Home Page
 *  Route: GET http://localhost:3001/
 */
app.get('/', (req, res) => {
    res.send(`
        <h1>Phonebook Backend</h1>
        <p>Available routes:</p>
        <ul>
            <li><a href="/api/persons">GET /api/persons</a> - Get all phonebook entries</li>
            <li><a href="/info">GET /info</a> - Get phonebook statistics</li>
        </ul>
    `);
});

/**
 *  Get all persons
 *  Route: GET http://localhost:3001/api/persons
 */
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

/**
 *  Get phonebook information
 *  Route: GET http://localhost:3001/info
 */
app.get('/info', (req, res) => {
    res.send(`
        <h1>Phonebook Info</h1>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>Current time: ${new Date()}</p>
    `);
});

/**
 *  Get a single person by ID
 *  Route: GET http://localhost:3001/api/persons/:id
 */
app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === req.params.id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ error: 'Person not found' });
    }
});

/**
 *  Delete a person by ID
 *  Route: DELETE http://localhost:3001/api/persons/:id
 */
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const initialLength = persons.length;
    persons = persons.filter(p => p.id !== id);

    if (persons.length < initialLength) {
        res.status(204).end(); // No Content (successful deletion)
    } else {
        res.status(404).json({ error: 'Person not found' });
    }
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
