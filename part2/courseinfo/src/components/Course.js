const Header = ({ name }) => (
    <h2>{name}</h2>
  )
  
  const Part = (props) => (
    <p>
      {props.name} {props.exercise}
    </p>
  )
  
  const Content = ({ course }) => (
    <>
      {course.parts.map(part => <Part key={part.id} name={part.name} exercise={part.exercises} />)}
    </>
  )
  
  const Total = ({ course }) => {
    const sum = course.parts.reduce((s, p) => s + p.exercises, 0)
    return <p><b>Number of exercises {sum}</b></p>
  }
  
  const Course = ({ course }) => {
    return <>
      <Header name={course.name} />
      <Content course={course} />
      <Total course={course} />
    </>
  }

  export default Course