const Part = ({ name, exercises }) => {
    console.log(`Part: ${name}, Exercises: ${exercises}`)
    return (<p>{name}: {exercises} excercises</p>)
}

export default Part