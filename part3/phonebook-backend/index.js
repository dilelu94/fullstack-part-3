const { response, request } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})