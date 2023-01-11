require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

app.use(express.static('build'))
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
    .catch(err => {
        response.status(404).send(err.message)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
})

app.post('/api/notes', (request, response) => {
    const body = request.body
    if (request.body === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: request.body.content,
        important: request.body.important || false,
        date: new Date()
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.put('/api/notes/:id', (request, response) => {
    const body = request.body

    if (!body.content || body.important === null) {
        return response.status(400).json({
            error: 'content or important missing'
        })
    }

    const id = Number(request.params.id)

    const oldNote = notes.find(n => n.id === id)
    // Update content and important but keep date and id
    const note = {
        id: oldNote.id,
        date: oldNote.date,
        content: body.content,
        important: body.important
    }

    notes = notes.map(n => n.id === id ? note : n)

    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})