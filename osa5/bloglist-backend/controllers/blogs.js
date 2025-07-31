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

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  logger.info(`Fetched blog: "${request.params.id}"`)
  if (blog) {
    response.json(blog)
  } else {
    logger.error(`Blog with id "${request.params.id}" not found`)
    response.status(404).end()
  }
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
  logger.info(`Blog "${populatedBlog.title}" populated with user data`)
  res.status(201).json(populatedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }
  logger.info(`Updating blog with id "${request.params.id}". Blog: ${JSON.stringify(blog)}`)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  logger.info(`Blog with id "${request.params.id}" updated`)
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.delete('/:id', tokenExtractor, async (request, response) => {
  console.log('Deleting blog with id:', request.params.id)
  const id = request.params.id
  const blog = await Blog.findById(id)

  console.log('request.token:', request.token)
  console.log('request.token.id:', request.token && request.token.id)
  console.log('blog.user:', blog.user)

  // Tarkista löytyykö blogi
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  logger.info('Blog.user:', blog.user.toString())
  logger.info('Token id:', request.token.id)

  // Tarkista että token on olemassa ja käyttäjä on blogin omistaja
  if (!request.token || !request.token.id || blog.user.toString() !== request.token.id) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndDelete(id)
  logger.info(`Blog with id "${id}" deleted`)
  response.status(204).end()
})

/*
blogsRouter.delete('/:id', tokenExtractor, async (req, res) => {
  const id = req.params.id
  await Blog.findByIdAndDelete(id)
  logger.info(`Blog with id "${id}" deleted`)
  res.status(204).end()
})*/

module.exports = blogsRouter