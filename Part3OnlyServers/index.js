const express = require('express');
const app = express();

const cors=require('cors')
app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.get('/info', (request, response) => {
    const person_count = persons.length;
    const currentTime = new Date();
    response.send(`
        <div>
            <p>Phone book has entry for ${person_count} people</p>
            <p>${currentTime}</p>
        </div>
    `);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    console.log(`Received DELETE request for id: ${id}`);

    const initialLength = persons.length;
    persons = persons.filter(person => person.id !== id);

    if (persons.length < initialLength) {
        console.log(`Person with id: ${id} deleted successfully`);
        response.status(204).end();
    } else {
        console.log(`Person with id: ${id} not found`);
        response.status(404).end();
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    const person = {
        id: getRandomInt(3000).toString(),
        name: body.name,
        number: body.number
    };

    persons.push(person);

    response.json(person);
});



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
