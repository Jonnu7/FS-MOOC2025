const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

app.use(express.json())
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const path = require('path')
app.use(express.static(path.resolve(__dirname, '../puhelinluettelon_frontend/dist')))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
  console.log('GET request to /')
})

// Palauttaa kaikki henkilöt
app.get('/api/persons', (req, res) => {
  res.json(persons)
  console.log('GET request to /api/persons: ', persons)
})

// Palauttaa yhden henkilön id:n perusteella
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
  console.log(`GET request to /api/persons/${id}: `, person || 'not found')
})

// Poista henkilö id:n perusteella
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
  console.log(`DELETE request to /api/persons/${id}: `, person || 'not found')
})

// Lisää uusi henkilö
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    console.log(`POST request failed: name or number missing: "${body.name}", "${body.number}"`)  
    return res.status(400).json({ error: 'name or number missing' })
  }
  if (persons.find(p => p.name === body.name)) {
    console.log(`POST request failed: name already exists: "${body.name}"`)
    return res.status(400).json({ error: 'name must be unique' })
  }

  

  const person = {
    id: Math.floor(Math.random() * 10000000),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  res.json(person)
  //console.log('POST request to /api/persons: ', person)
  console.log(`added person: ${person.name}, number: ${person.number}`)
  console.log('Body:', body)
})

app.get('/info', (req, res) => {
  const count = persons.length
  const date = new Date()
  res.send(
    `<div>
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    </div>`
  )
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../puhelinluettelon_frontend/dist/index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})