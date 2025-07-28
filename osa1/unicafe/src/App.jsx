import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => {
    //console.log('Button click:', text)
    return (
        <button onClick={handleClick}>{text}</button>
    )
}

const StatisticLine = ({ text, value }) => {
    //console.log('Renderöidään StatisticLine:', text, value)
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}


const Statistics = ({ good, neutral, bad }) => {
    console.log('Renderöidään Statistiikka:', { good, neutral, bad })
    const total = good + neutral + bad
    const average = total === 0 ? 0 : ((good - bad) / total).toFixed(2)
    const positive = total === 0 ? 0 : ((good / total) * 100).toFixed(1)

    if (total === 0) {
        console.log('Ei yhtään palautetta annettu')
        return <p>Ei yhtään palautetta annettu</p>
    }

    return (
        <div>
        <table>
            <tbody>
            <StatisticLine text="Hyvä" value={good} />
            <StatisticLine text="Neutraali" value={neutral} />
            <StatisticLine text="Huono" value={bad} />
            <StatisticLine text="Yhteensä" value={total} />
            <StatisticLine text="Keskiarvo" value={average} />
            <StatisticLine text="Positiivisia" value={positive + " %"} />
            </tbody>
        </table>
        </div>
    )
}

const App = () => {
    // tallenna napit omaan tilaansa
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    console.log('Appin tila:', { good, neutral, bad })

    return (
        <div>
            <Header text="Anna palautetta Unicafelle" />
            <Button handleClick={() => setGood(good + 1)} text="Hyvä" />
            <Button handleClick={() => setNeutral(neutral + 1)} text="Neutraali" />
            <Button handleClick={() => setBad(bad + 1)} text="Huono" />
            <Header text="Statistiikka" />
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App