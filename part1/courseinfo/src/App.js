const Header = ({ course }) => (
  <h1>{course.name}</h1>
)

const Part = (props) => (
  <p>
    {props.name} {props.exercise}
  </p>
)

const Content = ({ parts }) => (
  <>
    {parts.map(part => <Part key={part.id} name={part.name} exercise={part.exercises} />)}
  </>
)

const Total = ({ parts }) => {
  const sum = parts.reduce((s, p) => s + p.exercises, 0)
  return <p><b>Number of exercises {sum}</b></p>
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App