const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackluque:${password}@cluster0.q58hehj.mongodb.net/?retryWrites=true&w=majority`

mongoose
    .connect(url)
    .then((result) => {
        notes.find({}).then(result => {
            result.forEach(note => {
                console.log(note)
            })
            mongoose.connection.close()
        })
    })