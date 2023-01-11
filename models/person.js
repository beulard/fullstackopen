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

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)
