const mongoose = require('mongoose')

if (process.argv.length < 5) {
    console.log('Missing args.')
    console.log(`Usage: ${process.argv[0]} ${process.argv[1]} PASSWORD NEWNAME NEWNUMBER`)
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

console.log(`Name ${newName} number ${newNumber}`)

const url = `mongodb+srv://beulard:${password}@cluster0.ipdmcx2.mongodb.net/phonebook?retryWrites=true&w=majority`

const nameSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Name = mongoose.model('Name', nameSchema)

mongoose
    .connect(url)
    .then(() => {
        console.log('connected')
        const newEntry = new Name({
            name: newName,
            number: newNumber
        })
        return newEntry.save().then((result) => {
            console.log(`added ${result.name} to phonebook with number ${result.number}`)
        })
    })
    .then(() => {
        mongoose.connection.close()
    })
    .catch(err => console.log('ERROR LOL', err))
