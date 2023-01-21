const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackluque:${password}@cluster0.q58hehj.mongodb.net/noteApp?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log(`connected ${result}`)

    const note = new Note({
      content: process.argv[3],
      date: process.argv[4],
      important: process.argv[5],
    })

    return note.save()
  })
  .then(() => {
    Note.find({}).then((result) => {
      result.forEach((note) => {
        console.log(note)
      })
      console.log('note saved!')
      return mongoose.connection.close()
    })
      .catch((err) => console.log(err))
  })
