const { info } = require('./logger')

const requestLogger = (request, response, next) => {
    info(`${request.method} ${request.url} ${response.statusCode}${request.method === 'POST' ? ' ' + JSON.stringify(request.body) : ''}`)
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}