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

const { response, request } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }
]

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

/* Fetching a single resource */
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

/* update (aka put)*/
app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const updatedNote = request.body
    // Find the index of the note to update in the "database"
    const index = notes.findIndex(note => note.id == id)
    if (index === -1) {
        // Return an error if the note cannot be found
        return response.status(404).json({
            error: 'Note not found'
        });
    }
    // Update the note in the "database"
    notes[index] = updatedNote
    // Return the updated note
    response.json(updatedNote)
})

/* Deleting resources */
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(n => n.id !== id)

    response.status(204).end()
})

/* Generating id */
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

/* Receiving data */
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

/* home page */
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

/* string page */
app.get('/api/notes', (request, response) => {
    response.json(notes)
})

/* middleware (catch request made to non-existent routes) */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})