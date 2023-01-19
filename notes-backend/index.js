/* npm init -y */
/* npm install --save-dev nodemon */
/* Set-ExecutionPolicy Unrestricted */
/* npm install express */
/* npm start */
/* npm run dev */

/* Fly.io */
/* fly auth login */

/* { name: 'John', age: 30 } object */
/* {"name":"John","age":30} json, string */

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))

/* home page */
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

/* Mongoose Receiving data */
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

/* Mongoose string page */
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

/* Deleting resources */
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(n => n.id !== id)

    response.status(204).end()
})

/* Mongoose Fetching a single resource */
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

/* update (aka put)*/
app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const updatedNote = request.body

    Note.findByIdAndUpdate(id, updatedNote, { new: true }, (err, note) => {
        if (err) {
            return response.status(404).json({
                error: 'Note not found'
            })
        }
        response.json(note)
    })
})

/* deprecated
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
} */

/* middleware (catch request made to non-existent routes) */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

/* Express error handlers are middleware */
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})