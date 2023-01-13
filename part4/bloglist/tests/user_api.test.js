const mongoose = require('mongoose')
const config = require('../utils/config')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeAll(async () => {
    await mongoose.disconnect()
    await mongoose.connect(config.MONGODB_URI)
})

describe('adding a user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })
    test(
        'with invalid username or password returns ' +
        'status 400 and does not create the user',
        async () => {
            let newUser = {
                username: 'e', // too short
                password: 'valid_password'
            }
            let response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            expect(response.body.error)
                .toContain('validation failed')

            newUser = {
                username: 'valid_username',
                password: '2s' // too short
            }
            response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            expect(response.body.error)
                .toContain('too short')

            // Check that neither 'e' nor 'valid_username'
            // were added to the database, i.e. it is empty
            const users = await User.find({})
            expect(users).toHaveLength(0)
        })
})

afterAll(async () => {
    await mongoose.disconnect()
})