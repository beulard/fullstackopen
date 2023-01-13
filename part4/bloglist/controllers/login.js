const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body
    const targetUser = await User.findOne({ username: username })
    if (!targetUser) {
        return res.status(400).json({
            error: 'user does not exist'
        })
    }
    const passwordCorrect = await bcrypt.compare(password, targetUser.passwordHash)
    if (!passwordCorrect) {
        return res.status(401).json({
            error: 'password incorrect'
        })
    }

    const token = jwt.sign(
        { username: username, name: targetUser.name },
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    res.status(200).json({ username, token })
})

module.exports = loginRouter