const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notes = require('./controllers/notes')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message)
    })

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app