import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user  }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    background: '#f9f9f9'
  }

  const showRemove =
    user && blog.user && (
      blog.user.username === user.username || blog.user.id === user.id
    )

  /*
  const handleLike = async () => {
    const updatedBlog = {
      user: blog.user && typeof blog.user === 'object' && blog.user.id
      ? blog.user.id
      : blog.user || undefined,
      likes: likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    try {
      await blogsService.update(blog.id, updatedBlog)
      setLikes(likes + 1)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }
*/
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} - by: {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          <div>
            Likes: {blog.likes ?? 0} <button onClick={() => handleLike(blog.id)}>like</button>
          </div>
          <div>Url: {blog.url}</div>
          <div>Added by: {blog.user && blog.user.name}</div>
          {showRemove && (
            <button
              style={{ background: 'red', color: 'white', marginTop: 5 }}
              onClick={() => handleRemove(blog)}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog