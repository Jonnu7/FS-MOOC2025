const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] //|| process.env.MONGODB_PASSWORD , jos haluan käyttää vielä tätä
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://johannes:${password}@cluster0.yo7yzfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Listaa henkilöt
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    console.log('Persons listed successfully. Closing connection.')
  })
} else if (process.argv.length === 5) {
  // Lisää uusi henkilö
  const person = new Person({
    name: name,
    number: number,    
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    console.log('Closing connection.')
  })
} else {
    // Ohjeista käyttäjää, jos väärä määrä argumentteja
    console.log('Invalid number of arguments. Expected 3 (list) or 5 (add) arguments.')
    console.log('usage:')
    console.log('  node mongo.js <password> [<name> <number>]')
    mongoose.connection.close()
}