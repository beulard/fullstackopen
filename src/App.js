import { useState } from 'react'


const StatisticLine = ({text, value, postText=''}) => (
  <tr>
    <td>{text}</td><td>{value}{postText}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  if (good + neutral + bad > 0) {
  return <div>
    <h1>stats</h1>
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="average" value={((good * 1 + neutral * 0 + bad * -1) / (good+neutral+bad)).toFixed(2)} />
        <StatisticLine text="positive" value={((good) / (good+neutral+bad) * 100).toFixed(1)} postText=' %' />
      </tbody>
    </table>
  </div>
  }
  else {
    return <div>
      <h1>stats</h1>
       No feedback given
    </div>
  }
}

const Button = ({onClick, text}) =>
  <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good+1)
  const increaseNeutral = () => setNeutral(neutral+1)
  const increaseBad = () => setBad(bad+1)

  

  return (
    <>
      <h1>
        give feedback
      </h1>
      <Button onClick={increaseGood} text="+" />
      <Button onClick={increaseNeutral} text="0" />
      <Button onClick={increaseBad} text="-" />
        
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App