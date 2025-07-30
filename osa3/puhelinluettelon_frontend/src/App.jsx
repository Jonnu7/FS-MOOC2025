import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import PersonService from './services/PersonsService'
import './App.css'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState({ message: null, type: null })


    useEffect(() => {
        PersonService
            .getAll()
            .then(data => {
                setPersons(data)
                console.log('Persons fetched:', data)
            })
    }, [])

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification({ message: null, type: null })
        }, 4000)
    }

    const handleInputChange = (event) => {
        //console.log('Name input value:', event.target.value)
        setNewName(event.target.value)
    }
    
    

    const addPerson = (event) => {
        event.preventDefault()
        const existingPerson = persons.find(person => person.name === newName)
        if (existingPerson) {
            console.log(`Person with name "${newName}" already exists.`)
            if (window.confirm(                
                `${newName} is already added to phonebook, replace the old number with a new one?`
            )) {
                const updatedPerson = { ...existingPerson, number: newNumber }
                PersonService
                    .update(existingPerson.id, updatedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(person =>
                            person.id !== existingPerson.id ? person : returnedPerson
                        ))
                        showNotification(`Number updated for "${returnedPerson.name}"`,
                            'success'
                        )
                        console.log('Persons number updated:', returnedPerson)
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        showNotification(
                            `Error: "${existingPerson.name}" has been removed from server during update or unexpected error occurred`,
                            'error'
                        )
                        setPersons(persons.filter(p => p.id !== existingPerson.id))
                        console.log('Update failed, person already removed during update or something unexpected happened:', existingPerson)
                    })
            }
            return
        }
        const personObject = { name: newName, number: newNumber }
        PersonService
            .create(personObject)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                showNotification(`Added ${returnedPerson.name}`,
                    'success'
                )
                console.log('Person added:', returnedPerson)
                setNewName('')
                setNewNumber('')
            })
            .catch(error => {
                showNotification('Failed to add person',
                  'error'
                )
                console.log('Add failed:', error)
            })
    }

    const handleNumberChange = (event) => {
      //console.log('Number input value:', event.target.value)
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
      //console.log('filter change input:', event.target.value)
        setFilter(event.target.value)
    }

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete "${name}"?`)) {
            PersonService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                    showNotification(`Deleted ${name}`,
                        'success' 
                    )
                    console.log(`Person "${name}" deleted. ID: ${id}`)
                })
                .catch(error => {
                    showNotification(
                        `Error: "${name}" has already been removed from server`,
                        'error'
                    )
                    setPersons(persons.filter(person => person.id !== id))
                    console.log(`Delete failed, person already removed: "${name}"`)
                })
        }
    }

    //Rajataan näytettävät henkilöt filterin perusteella
    const personsToShow = persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )

    return (
    <div>
      <h2>Phonebook v2</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <br></br>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleInputChange={handleInputChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <div>
      debug: name: {newName} | number: {newNumber} | filter: {filter}
      </div>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App