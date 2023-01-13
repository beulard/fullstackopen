const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(err => {
        console.log('error connecting to MongoDB:', err)
    })


const server = http.createServer(app)
server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})