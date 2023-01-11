const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI_PHONEBOOK)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(err => {
        console.log('failed to connect to MongoDB:', err.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

module.exports = mongoose.model('Person', personSchema)
