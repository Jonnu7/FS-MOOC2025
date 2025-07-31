const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const tokenExtractor = require('../utils/tokenExtractor')
const logger = require('../utils/logger')

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password || password.length < 3) {
    logger.error('Password must be at least 3 characters long')
    return res.status(400).json({ error: 'Password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  logger.info('Creating user:', user)

  const savedUser = await user.save()
  logger.info('User created:', savedUser.username)
  res.status(201).json(savedUser)
})

usersRouter.get('/', tokenExtractor, async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  logger.info('Fetched all users')
  res.json(users)
})

module.exports = usersRouter