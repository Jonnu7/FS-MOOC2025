const initialBlogs = [
  {
    title: 'Testiblogi 1',
    author: 'Testaaja',
    url: 'http://testi1.fi',
    likes: 1,
  },
  {
    title: 'How to be OSRS noob',
    author: 'Ghxst',
    url: 'http://Ghxst.gg',
    likes: 2,
  },
]
const blogsInDb = async (Blog) => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
}

