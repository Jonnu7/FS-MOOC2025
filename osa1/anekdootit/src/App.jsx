import { useState } from 'react'




const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

    const handleNextAnecdote = () => {
        const randomIndex = Math.floor(Math.random() * anecdotes.length)
        console.log('Seuraava rng numero:', randomIndex)
        console.log('Seuraava anekdootti:', anecdotes[randomIndex])
        setSelected(randomIndex)
    }

    const handleVote = () => {
            const copy = [...votes]
            copy[selected] += 1
            setVotes(copy)
            //console.log('Äänestys total:', copy)
            console.log('Äänestetty anekdootti +1:', anecdotes[selected])
        }
    

    // Etsi eniten ääniä saanut anekdootti
    const maxVotes = Math.max(...votes)
    const mostVotedIndex = votes.indexOf(maxVotes)

    return (
        <div>
            <h1>Sattumanvarainen, mutta ei satunnainen, anekdootti</h1>
            <p>{anecdotes[selected]}</p>
            <p>Äänet: {votes[selected]}</p>
            <button onClick={handleVote}>Vote</button>
            <button onClick={handleNextAnecdote}>Next Anecdote</button>

            <h2>Maailman suosituin anekdootti</h2>
            {maxVotes === 0 ? (<p>Yhtäkään anekdoottia ei ole äänestetty! Äänestä suosikkiasi nyt heti!</p>) :
              (
                <>
                    <p>{anecdotes[mostVotedIndex]}</p>
                    <p>Ääniä yhteensä: {votes[mostVotedIndex]}</p>
                </>
            )}
        </div>
    )
}

export default App