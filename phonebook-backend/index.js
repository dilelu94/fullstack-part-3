const { response, request } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')

/* mongoose */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://fullstackluque:${password}@cluster0.q58hehj.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
/* end mongoose */

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

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

/* morgan middleware */
/* const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', { stream: process.stdout })) */

/* home page */
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

/* persons string page */
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

/* /info */ /* el navegador te formatea la fecha gratis XDD */
app.get('/info', (request, response) => {
    const phonebookEntries = persons.length
    const date = new Date()
    console.log(date)
    response.send(
        `<p>Phonebook has info for ${phonebookEntries} people</p>
        <p>${date}</p>`
    )
})

/* Fetching a single resource */
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

/* Deleting resources */
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(n => n.id !== id)

    response.status(204).end()
})

/* Generating id */
const generateId = () => {
    return Math.floor(Math.random() * (9999999999999 - 1 + 1)) + 1
    /*     const maxId = persons.length > 0
            ? Math.max(...persons.map(n => n.id))
            : 0
        return maxId + 1 */
}

/* Receiving data (aka post)*/
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing or number missing'
        })
    }

    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

/* middleware (catch request made to non-existent routes) */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
/*  */


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})