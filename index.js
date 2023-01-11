require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())

morgan.token('post-data', (request, response) => {
    if (request.method == 'POST') {
        return JSON.stringify(request.body)
    } else {
        return null
    }
})
logger = morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['post-data'](req, res)
    ].join(' ')
})

app.use(logger)

// Data
persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, resp) => {
    resp.send('Hello world')
})

app.get('/info', (req, resp) => {
    Person.count({}).then(count => {
        resp.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
    })
})

app.get('/api/persons', (req, resp) => {
    Person.find({}).then(persons => {
        resp.json(persons)
    })
})

app.get('/api/persons/:id', (req, resp) => {
    Person.findById(req.params.id).then(person => {
        resp.json(person)
    })
    .catch(err => {
        resp.status(404).send(err.message)
    })
})

app.delete('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    resp.status(204).end()
})

app.post('/api/persons', (req, resp) => {
    const body = req.body
    if (!body.name || !body.number) {
        return resp.status(400).json({
            error: 'missing name or number'
        })
    }
    if (persons.find(p => p.name === body.name)) {
        return resp.status(400).json({
            error: 'person with same name already in phonebook'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(returnedPerson => {
        resp.json(returnedPerson)
    })
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || "3001"

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})