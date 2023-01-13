import { useEffect, useState } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import './index.css'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Footer = () => {
  const style = {
    color: 'blue',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={style}>
      <br />
      <em>Note app, beulard, 2023</em>
    </div>
  )
}

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error')

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  

  const addNote = (event) => {
    event.preventDefault()
    
    const note = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(note)
      .then(createdNote => {
        setNotes([...notes, createdNote])
        setNewNote('')
      })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(updatedNote => {
        setNotes(notes.map(note => note.id !== id ? note : updatedNote))
      })
      .catch(error => {
        setErrorMessage(`the note ${note.content} was already deleted from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={event => setNewNote(event.target.value)} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App