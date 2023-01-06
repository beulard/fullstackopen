import { useEffect, useState, useRef } from 'react'
import personService from './services/persons'

const SearchFilter = ({ searchValue, setSearchValue }) =>
  <div>
    search for name: <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
  </div>

const Persons = ({ persons, handleDeletePerson, setStatusMessage }) =>
  <ul>
    {
      persons.map(p => <li key={p.id}>{p.name} {p.number} <button onClick={() => handleDeletePerson(p.id, p.name)}>delete</button></li>)
    }
  </ul>

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, addName }) =>
  <form>
    <div>
      name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
      number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} />
    </div>
    <div>
      <button onClick={addName} type="submit">add</button>
    </div>
  </form>

const Notification = ({message, color}) => {
  if (message === null) {
    return null
  }

  const style = {
    color: color,
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  
  return (
    <div style={style}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [statusMessage, setStatusMessage] = useState('test')
  const [statusMessageColor, setStatusMessageColor] = useState('green')
  const notificationTimeoutRef = useRef()

  const resetAndStartTimer = (ms = 2500) => {
    clearTimeout(notificationTimeoutRef.current)
    notificationTimeoutRef.current = setTimeout(() => setStatusMessage(null), 2500)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    // Handle case where the same person is added twice
    const duplicatePerson = persons.find(p => p.name === newName)
    if (duplicatePerson) {
      if (window.confirm(`Replace ${newName}'s number with ${newNumber}?`)) {
        personService
          .updatePerson(duplicatePerson.id, { ...duplicatePerson, number: newNumber })
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p))
            setStatusMessage(`Changed ${newName}'s number to ${newNumber}`)
            setStatusMessageColor('yellow')
            resetAndStartTimer()
          })
          .catch(error => {
            setStatusMessage(`Couldn't change ${newName}'s number: person has been removed from database`)
            setStatusMessageColor('red')
            // Remove person from list
            setPersons(persons.filter(p => p.id !== duplicatePerson.id))
            resetAndStartTimer()
          })
      }
      return
    }
    const newPerson = { name: newName, number: newNumber }
    personService
      .addPerson(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setStatusMessage(`Added ${newName} to address book`)
        setStatusMessageColor('green')
        resetAndStartTimer()
      })

    setNewName('')
    setNewNumber('')
  }

  const handleDeletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name} from address book?`))
      return
    
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setStatusMessage(`Deleted ${name} from address book`)
        setStatusMessageColor('orange')
        resetAndStartTimer()
      })
  }

  const personsToShow = (searchValue === '') ? persons : persons.filter(p => p.name.toLowerCase().search(searchValue.toLowerCase()) !== -1)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={statusMessage} color={statusMessageColor} />
      <SearchFilter searchValue={searchValue} setSearchValue={setSearchValue} />
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addName={addName}
        setStatusMessage={setStatusMessage}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleDeletePerson={handleDeletePerson} setStatusMessage={setStatusMessage} />
      
    </div>
  )
}

export default App