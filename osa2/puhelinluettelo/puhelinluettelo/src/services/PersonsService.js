import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  console.log('getAll request:', request)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  console.log('create request:', request)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  console.log('update request:', request)
  return request.then(response => response.data)
}

const remove = id => {
    console.log(`Removing person with id: ${id}`)
  return axios.delete(`${baseUrl}/${id}`)
}

export default { 
  getAll, 
  create,
  update,
  remove
}