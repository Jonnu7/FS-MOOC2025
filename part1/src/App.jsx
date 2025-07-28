import { useState } from 'react'

const Display = ({ counter }) => <div>{counter}</div>


const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const History = (props) => {  if (props.allClicks.length === 0) {    return (      <div>        the app is used by pressing the buttons      </div>    )  }  return (    <div>      button press history: {props.allClicks.join(' ')}    </div>  )}


const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    console.log('left before', left)
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    console.log('left after', left)
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)

    setTotal(left + right)
  }

  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right' />
      {right}
      <History allClicks={allClicks} />

      <p>total {total}</p>
    </div>
  )
}

export default App