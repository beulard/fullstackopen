const express = require('express')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

module.exports = app