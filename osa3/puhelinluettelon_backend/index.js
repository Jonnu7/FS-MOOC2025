const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

app.use(express.json())
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const path = require('path')
app.use(express.static('dist'))
require('dotenv').config()


const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)

const Person = require('./models/person')

/*
// Muu backend
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
  */

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
  console.log('GET request to /')
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      res.send(
        `<p>Phonebook has info for ${count} people</p>
         <p>${date}</p>`
      )
    })
    .catch(error => next(error))
})

// Palauttaa kaikki henkilöt
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
    console.log('GET request to /api/persons: ', persons)
  })
  .catch(error => next(error))
})

// Palauttaa yhden henkilön id:n perusteella
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
      console.log(`GET request to /api/persons/${req.params.id}: `, person || 'not found')
    })
    //.catch(error => {
      //res.status(400).send({ error: 'malformatted id' })
    //})
    .catch(error => next(error))
})

// Poista henkilö id:n perusteella
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id) //findByIdAndRemove
    .then(result => {
      res.status(204).end()
      console.log(`DELETE request to /api/persons/${req.params.id}: `, result || 'not found')
    })
    /*
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })*/
   .catch(error => next(error))
})

//Put
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
    console.log(`PUT request to /api/persons/${req.params.id}: `, { name, number })
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
        console.log(`PUT request to /api/persons/${req.params.id}: `, updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Lisää uusi henkilö
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    console.log(`POST request failed: name or number missing: "${body.name}", "${body.number}"`)  
    return res.status(400).json({ error: 'name or number missing' })
  }

  // Tarkista onko nimi jo olemassa tietokannassa
  Person.findOne({ name: body.name }).then(existing => {
    if (existing) {
      console.log(`POST request failed: name already exists: "${body.name}"`)
      return res.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
      console.log(`added person: ${savedPerson.name}, number: ${savedPerson.number}`)
      console.log('Body:', body)
    })
    .catch(error => next(error))
  })
  .catch(error => next(error))
})


// Olemattomien osoitteiden käsittely
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Keskitetty virheidenkäsittelymiddleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  res.status(500).json({ error: 'internal server error' })
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})