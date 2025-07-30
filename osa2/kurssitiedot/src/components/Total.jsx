const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    console.log(`Total: ${parts.map(p => p.exercises).join(', ')}. Total total: ${total}`)
    return (<p>Total number of exercises: {total}</p>)
}

export default Total