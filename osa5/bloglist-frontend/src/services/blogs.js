import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
export const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  console.log('getAll request:', request)
  return request.then(response => response.data)
}

const create = async (blog) => {
  const config = { headers: { Authorization: token } }
  console.log('create request:', blog)
  const response = await axios.post(baseUrl, blog, config)
  console.log('create response:', response)
  return response.data
}

const update = async (id, updatedBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  console.log(`update request to /api/blogs/${id}:`, updatedBlog)
  console.log(`Request response:${response.data}:`)
  return response.data
}

const remove = async (id) => {
  console.log('Token used for delete:', token)
  const config = { headers: { Authorization: token } }
  return axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, setToken, update, remove }