const mongoose = require('mongoose')

const nameSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Name = mongoose.model('Person', nameSchema)

const fetchPhonebook = (password) => {
    const url = `mongodb+srv://beulard:${password}@cluster0.ipdmcx2.mongodb.net/phonebook?retryWrites=true&w=majority`
    mongoose
        .connect(url)
        .then(() => {
            console.log('connected')
            console.log('phonebook:')
            Name.find({}).then(people => {
                people.forEach(p => {
                    console.log(`${p.name} ${p.number}`)
                })
            })
                .then(() => {
                    mongoose.connection.close()
                })
                .catch(err => console.log('ERROR LOL', err))
        })
}

const addPerson = (password, newName, newNumber) => {
    const url = `mongodb+srv://beulard:${password}@cluster0.ipdmcx2.mongodb.net/phonebook?retryWrites=true&w=majority`
    console.log(`Name ${newName} number ${newNumber}`)

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
}

if (process.argv.length === 3) {
    const password = process.argv[2]

    fetchPhonebook(password)
} else if (process.argv.length === 5) {
    const password = process.argv[2]
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    addPerson(password, newName, newNumber)
} else {
    console.log('Invalid args.')
    console.log('Usage:')
    console.log(`Add person: ${process.argv[0]} ${process.argv[1]} PASSWORD NEWNAME NEWNUMBER`)
    console.log(`Fetch phonebook: ${process.argv[0]} ${process.argv[1]} PASSWORD`)
    process.exit(1)
}