/* const { response, request } = require('express') */
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const Person = require('./models/persons')

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

/* mongoose persons string page */
app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
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

/* Mongoose Fetching a single resource */
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

/* Deleting resources */
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(n => n.id !== id)

    response.status(204).end()
})

/* Mongoose Receiving data (aka post)*/
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name === undefined) {
        return response.status(400).json({
            error: 'content missing or number missing'
        })
    }

    if (persons.some(p => p.name === body.name)) { //esto quizas no ande xd
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

/* middleware (catch request made to savedPerson-existent routes) */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
/* end catch */


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})