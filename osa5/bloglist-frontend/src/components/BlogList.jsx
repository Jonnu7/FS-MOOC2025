import Blog from './Blog'

const BlogList = ({ blogs, handleLike, handleRemove, user }) => {
  const sortedBlogs = [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
  return (
    <div>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
          user={user}
        />
      )}
    </div>
  )
}

export default BlogList