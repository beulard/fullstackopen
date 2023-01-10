const express = require('express')
const morgan = require('morgan')

app = express()

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
    resp.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (req, resp) => {
    resp.json(persons)
})

app.get('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (!person) {
        resp.status(404).end()
    } else {
        resp.json(persons.find(p => p.id === id))
    }
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

    const person = {
        id: Math.floor((Math.random() * 32000)),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)

    resp.json(person)

})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || "3001"

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})