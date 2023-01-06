import axios from 'axios'
import { useEffect, useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    axios
    .get("http://localhost:3001/notes")
    .then((response) => { 
      setNotes(response.data)
      console.log(response) 
    })
  }, [])

  

  const addNote = (event) => {
    event.preventDefault()
    //setNotes([...notes, note])
    const note = {
      id: notes.length + 1,
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }
    // setNotes([...notes, note])
    // setNewNote('')
    axios
      .post('http://localhost:3001/notes', note)
      .then(response => {
        setNotes([...notes, response.data])
        setNewNote('')
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={event => setNewNote(event.target.value)} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App