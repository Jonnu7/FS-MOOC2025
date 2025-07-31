require('dotenv').config()
const { describe, test, before, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { initialUsers } = require('../utils/user_helper')

const api = supertest(app)
const logger = require('../utils/logger')

let token = null

describe('user api (persistent)', () => {
  before(async () => {
    logger.info('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
  })

  beforeEach(async () => {
    await User.deleteMany({})
    // Luo käyttäjä ja hae token
    await api.post('/api/users').send(initialUsers[0])
    const loginResponse = await api
      .post('/api/login')
      .send({ username: initialUsers[0].username, password: initialUsers[0].password })
    token = loginResponse.body.token
  })

  test('a valid user can be created and has empty blogs array', async () => {
    const newUser = { username: 'uusiuser', name: 'Uusi', password: 'salasana' }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    logger.info('User created:', response.body)
    if (!Array.isArray(response.body.blogs)) {
      throw new Error('User does not have blogs array')
    }
    logger.info('User blogs:', response.body.blogs)
    const userInDb = await User.findOne({ username: newUser.username })
    logger.info('User in DB:', userInDb)
    if (!userInDb.blogs || userInDb.blogs.length !== 0) {
      throw new Error('User blogs array is not empty')
    }
  })

  test('users are returned as json and blogs are populated', async () => {
    const response = await api
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    logger.info('Users fetched:', response.body)
    response.body.forEach(user => {
      logger.info('User blogs:', user.blogs)
      if (!Array.isArray(user.blogs)) {
        throw new Error('User does not have blogs array', user)
      }
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})