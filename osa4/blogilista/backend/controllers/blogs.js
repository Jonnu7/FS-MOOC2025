const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const tokenExtractor = require('../utils/tokenExtractor')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  logger.info('Fetched all blogs')
  res.json(blogs)
})

blogsRouter.post('/', tokenExtractor, async (req, res) => {
  const body = req.body

  //Validate
  if (!req.token || !req.token.id) {
    logger.error('Missing or invalid token')
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  // Hae ensimmäinen käyttäjä
  //const user = await User.findOne({})
  const user = await User.findById(req.token.id)
  if (!user) {
    logger.error('No users in database, cannot add blog')
    return res.status(400).json({ error: 'No users in database' })
  }

  const blog = new Blog({
    ...body,
    user: user._id
  })

  const savedBlog = await blog.save()
  logger.info(`Blog "${savedBlog.title}" added by user "${user.username}"`)
  // Lisää blogi käyttäjän blogs-taulukkoon
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  // Palauta blogi käyttäjätiedoilla
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', tokenExtractor, async (req, res) => {
  const id = req.params.id
  await Blog.findByIdAndDelete(id)
  logger.info(`Blog with id "${id}" deleted`)
  res.status(204).end()
})

module.exports = blogsRouter