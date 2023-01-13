import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(1)
  const [score, setScore] = useState(new Array(anecdotes.length).fill(0))

  const selectRandom = () => {
    const num = Math.floor(Math.random() * anecdotes.length)
    //console.log(num)
    setSelected(num)
  }
  
  const addVote = () => {
    const score_ = [ ...score ]
    score_[selected] += 1
    setScore(score_)
  }

  const mostVoted = () => {
    var argMax = -1
    var valMax = -1
    for(var i=0; i<score.length; i++) {
      if (score[i] > valMax) {
        valMax = score[i]
        argMax = i
      }
    }
    return argMax
  }
  
  return <>
   <h1>Random anecdote</h1>
      <div>
        {anecdotes[selected]}
      </div>
      <div>
        has {score[selected]} votes.
      </div>
      <div>
        <button onClick={addVote}>vote</button>
        <button onClick={selectRandom}>next anecdote</button>
      </div>
      <div>
        <h1>Anecdote with most votes</h1>
        <div>
          {anecdotes[mostVoted()]}
        </div>
        <div>
          has {score[mostVoted()]} votes
        </div>
      </div>
    </>
}

export default App