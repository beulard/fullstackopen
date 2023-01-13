const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI_PHONEBOOK)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(err => {
        console.log('failed to connect to MongoDB:', err.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Below minimum length of 3'],
        required: true
    },
    number: {
        type: String,
        minLength: [8, 'Below minimum length of 8'],
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
