const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (req, res) => {
    const body = req.body

    const duplicate = await User.findOne({ username: body.username })
    if (duplicate) {
        return res.status(400).json({
            error: 'username already registered'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })
    const returnedUser = await user.save()
    res.status(201).json(returnedUser)
})

module.exports = usersRouter