const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        req.token = auth.substring(7)
    }

    next()
}

const userExtractor = async (req, res, next) => {
    const token = req.token
    if (!token) {
        return next()
    }

    const identity = jwt
        .verify(token, process.env.SECRET)

    const user = await User.findOne({
        username: identity.username
    })

    req.user = user

    next()
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'CastError') {
        return response.status(400).json({
            error: 'bad id'
        })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'bad token' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

module.exports = {
    tokenExtractor,
    userExtractor,
    errorHandler
}