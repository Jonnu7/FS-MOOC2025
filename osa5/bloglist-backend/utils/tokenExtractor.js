const jwt = require('jsonwebtoken')
const logger = require('./logger')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.token = jwt.verify(authorization.substring(7), process.env.SECRET)
    } catch (error) {
      logger.error('Token verification failed:', error.message)
      return res.status(401).json({ error: 'invalid token' })
    }
  } else {
    logger.error('Authorization header missing or invalid')
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  next()
}

module.exports = tokenExtractor