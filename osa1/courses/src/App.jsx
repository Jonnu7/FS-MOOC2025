const Header = ({ course }) => {  
    console.log(`Header: ${course.name}`)
    return (<h1>{course.name}</h1>)
}

const Part = ({ name, exercises }) => {
    console.log(`Part: ${name}, Exercises: ${exercises}`)
    return (<p>{name}: {exercises} excercises</p>)
}

const Content = ({ parts }) => {
    console.log(`Content: ${parts.map(p => `${p.name}, ${p.exercises}`).join(', ')}`)
    return (
      <div>
          {parts.map((part, i) => (
              <Part key={i} name={part.name} exercises={part.exercises} />
          ))}
      </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    console.log(`Total: ${parts.map(p => p.exercises).join(', ')}`)
    return (<p>Total number of exercises: {total}</p>)
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