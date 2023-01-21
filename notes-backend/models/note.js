const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then((result) => {
    console.log(`connected to MongoDB ${result}`)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  date: {
    type: Date,
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    returnedObject.id = returnedObject._id.toString()
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    delete returnedObject._id
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Note', noteSchema)
