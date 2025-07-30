import Part from './Part'

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

export default Content