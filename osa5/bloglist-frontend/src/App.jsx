import { useState, useEffect, useRef } from 'react'
import blogsService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogsService.getAll().then(setBlogs)
  }, [])

  useEffect(() => {
    console.log('Blogs fetched:', blogs)
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    console.log('Logged user useEffect JSON:', loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogsService.setToken(user.token)
      console.log('Token set from localStorage:', user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      console.log('Logged in user:', user)
      setUser(user)
      blogsService.setToken(user.token)
      console.log('Token set to blogService:', user.token)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      console.log('Login success: User set and saved to loc storage:', user)
      setTimeout(() => setSuccess(null), 3000)
      console.log('Logged in user:', user)
    } catch (exception) {
      setError('Wrong credentials')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    console.log('User logged out')
    blogsService.setToken(null)
    window.localStorage.removeItem('loggedBlogUser')
    console.log('Local storage cleared')
    setTimeout(() => setSuccess(null), 3000)
    console.log('User logged out, local storage cleared')
  }



  const addBlog = async (blog) => {
    try {
      const newBlog = await blogsService.create(blog)
      setBlogs(blogs.concat(newBlog))
      setSuccess(`Added blog "${newBlog.title}" by ${newBlog.author}`)
      setTimeout(() => setSuccess(null), 3000)
      console.log('Blog added:', newBlog)
      blogFormRef.current.toggleVisibility() // Sulje lomake onnistuneen lisäyksen jälkeen
    } catch (exception) {
      setError('Error adding blog')
      setTimeout(() => setError(null), 3000)
      console.error('Error adding blog:', exception)
    }
  }


  const handleLike = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const updatedBlog = {
      ...blog,
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
    }
    try {
      const returnedBlog = await blogsService.update(id, updatedBlog)
      console.log(`Blog with id ${id} liked, new likes count:`, returnedBlog.likes)
      //blogsService.setToken(user.token)
      console.log('Token set for like operation:', user.token)
      setBlogs(blogs.map(b => b.id === id ? { ...b, likes: returnedBlog.likes } : b))
      console.log('Blogs updated after like:', blogs)
    } catch (error) {
      setError('Error updating likes')
      setTimeout(() => setError(null), 3000)
    }
  }


  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogsService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setSuccess(`Removed blog "${blog.title}"`)
        setTimeout(() => setSuccess(null), 3000)
      } catch (error) {
        setError('Error removing blog')
        setTimeout(() => setError(null), 3000)
      }
    }
  }



  if (user === null) {
    return (
      <div>
        <h2>Log in to my best bloglist of all time!</h2>
        {error && <Notification message={error} type="error" />}
        <Notification message={success} type="success" />
        <br />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>The blogs</h2>
      <Notification message={error} type="error" />
      <Notification message={success} type="success" />
      <div>
        {user.name} logged in, god damnit!
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      <BlogList blogs={blogs} handleLike={handleLike} handleRemove={handleRemove} user={user} />
    </div>
  )
}

export default App