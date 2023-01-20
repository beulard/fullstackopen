import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (user, blog) => {
  const config = {
    Authentication: `bearer ${user.token}`
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const module = {
  getAll,
  create
}

export default module