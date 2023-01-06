import { useEffect, useState } from 'react'
import axios from 'axios'

const SearchFilter = ({ searchValue, setSearchValue }) =>
  <div>
    search for name: <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
  </div>

const Persons = ({ persons }) =>
  <li>
    {
      persons.map(p => <ul key={p.name}>{p.name} {p.number}</ul>)
    }
  </li>

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

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => {
        setPersons(response.data)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    if (persons.find(p => p.name === newName)) {
      alert(`Can't add the same person (${newName}) twice!`)
      return
    }
    setPersons([...persons, { name: newName, number: newNumber }])
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = (searchValue === '') ? persons : persons.filter(p => p.name.toLowerCase().search(searchValue) !== -1)

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter searchValue={searchValue} setSearchValue={setSearchValue} />
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
      
    </div>
  )
}

export default App