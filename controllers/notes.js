const Note = require('../models/note')
const notesRouter = require('express').Router()

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
    const note = await Note.findById(request.params.id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

notesRouter.post('/', async (request, response) => {
    const { content, important } = request.body

    const note = new Note({
        content: content,
        important: important || false,
        date: new Date()
    })

    const savedNote = await note.save()
    response.status(201).json(savedNote)
})

notesRouter.put('/:id', async (request, response) => {
    const note = request.body

    const updatedNote = await Note.findByIdAndUpdate(
        request.params.id,
        note,
        { new: true, runValidators: true, context: 'query' }
    )

    response.json(updatedNote)
})

module.exports = notesRouter