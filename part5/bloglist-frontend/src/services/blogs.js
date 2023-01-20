import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blog) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  console.log(blog)
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const module = {
  getAll,
  create,
  setToken
}

export default module