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

app.get('/api/persons/:id', (req, resp, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            resp.json(person)
        } else {
            resp.status(404).end()
        }
    })
    .catch(err => { next(err) })
})

app.delete('/api/persons/:id', (req, resp, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            resp.status(204).end()
        })
        .catch(err => { next(err) })
})

app.post('/api/persons', (req, resp) => {
    const body = req.body
    if (!body.name || !body.number) {
        return resp.status(400).json({
            error: 'missing name or number'
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

app.put('/api/persons/:id', (req, res, next) => {
    console.log('in PUT')
    const person = req.body
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(err => { next(err) })
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || "3001"

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})