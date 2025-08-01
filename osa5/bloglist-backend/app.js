const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')



app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)


app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app