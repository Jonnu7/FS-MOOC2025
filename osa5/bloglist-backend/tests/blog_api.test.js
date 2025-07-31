require('dotenv').config()
const { describe, test, before, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb } = require('../utils/blog_helper')
const { initialUsers } = require('../utils/user_helper')
const api = supertest(app)
const logger = require('../utils/logger')

let token = null

describe('blog api', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    // Alusta käyttäjä ja hae token
    await api.post('/api/users').send(initialUsers[0])
    const loginResponse = await api
      .post('/api/login')
      .send({ username: initialUsers[0].username, password: initialUsers[0].password })
    token = loginResponse.body.token

    const userFromDb = await User.findOne({ username: initialUsers[0].username })
    const blogsWithUser = initialBlogs.map(blog => ({ ...blog, user: userFromDb._id }))
    await Blog.insertMany(blogsWithUser)
    // Päivitä käyttäjän blogit
    const blogs = await Blog.find({})
    userFromDb.blogs = blogs.map(b => b._id)
    await userFromDb.save()
  })

  test('blogs are returned as json and contain user info', async () => {
    const response = await api
      .get('/api/blogs')
      // .set('Authorization', `Bearer ${token}`) // Lisää tämä jos GET /api/blogs vaatii tokenin
      .expect(200)
      .expect('Content-Type', /application\/json/)
    logger.info('Blogs fetched:', response.body)
    response.body.forEach(blog => {
      if (!blog.user || !blog.user.username) {
        throw new Error('Blog does not contain user info')
      }
    })
  })

  test('all blogs are returned', async () => {
    const blogs = await blogsInDb(Blog)
    const response = await api.get('/api/blogs')
    logger.info('Blogs in DB:', blogs.length)
    logger.info('Blogs in response:', response.body.length)
    if (response.body.length !== blogs.length) {
      throw new Error(`Expected ${blogs.length} blogs, got ${response.body.length}`)
    }
  })

  test('blog objects have field named id', async () => {
    const response = await api.get('/api/blogs')
    logger.info('Blogs in response with id field:', response.body)
    response.body.forEach(blog => {
      if (!blog.id) {
        throw new Error('Blog object is missing id field')
      }
      if (blog._id) {
        throw new Error('Blog object should not have _id field')
      }
    })
  })

  test('a valid blog can be added and is linked to a user', async () => {
    const user = await User.findOne({})
    const newBlog = {
      title: 'Bränikkä blogi',
      author: 'Tony Testaaja',
      url: 'http://bränikkä.fi',
      likes: 10,
    }

    const blogsAtStart = await blogsInDb(Blog)
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    logger.info('Added blog:', response.body)
    if (!response.body.user || !response.body.user.username) {
      throw new Error('Added blog does not contain user info')
    }

    const blogsAtEnd = await blogsInDb(Blog)
    logger.info('Blogs at end:', blogsAtEnd.length)
    if (blogsAtEnd.length !== blogsAtStart.length + 1) {
      throw new Error('Amount of blogs did not increase as expected')
    }

    const updatedUser = await User.findById(user._id).populate('blogs')
    logger.info('User blogs after adding:', updatedUser.blogs.length)
    if (!updatedUser.blogs.some(b => b.title === newBlog.title)) {
      throw new Error('User blogs array did not update')
    }
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await blogsInDb(Blog)
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    logger.info(`Blog with id "${blogToDelete.id}" deleted`)
    const blogsAtEnd = await blogsInDb(Blog)
    logger.info('Blogs at end after deletion:', blogsAtEnd.length)
    if (blogsAtEnd.length !== blogsAtStart.length - 1) {
      throw new Error('Amount of blogs did not decrease as expected')
    }
  })


  test('adding a blog fails with 401 if token is missing', async () => {
    const newBlog = {
      title: 'Ei tokenia',
      author: 'Testaamaton',
      url: 'http://ei-tokenia.fi',
      likes: 1,
    }

    const blogsAtStart = await blogsInDb(Blog)

    await api
      .post('/api/blogs')
    //.set('Authorization', ...)
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await blogsInDb(Blog)
    logger.info('Blogs at end:', blogsAtEnd.length)
    if (blogsAtEnd.length !== blogsAtStart.length) {
      throw new Error('Blog was added without token!')
    }
  })


  after(async () => {
    await mongoose.connection.close()
  })
})