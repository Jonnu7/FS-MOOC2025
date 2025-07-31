const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

loginRouter.post('/', async (req, res) => {
  logger.info('Login attempt for user:', req.body.username)
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  logger.info('Password check for user:', username, 'result:', passwordCorrect)
  if (!(user && passwordCorrect)) {
    logger.error('Login failed for user:', req.body.username)
    return res.status(401).json({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
  logger.info('User logged in successfully:', user.username)
  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter