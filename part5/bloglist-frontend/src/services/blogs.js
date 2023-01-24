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

const modify = async (id, blog) => {
    const config = {
        headers: {
            Authorization: token
        }
    }
    console.log(blog)
    const response = await axios.put(`${baseUrl}/${id}`, blog, config)
    console.log(response)
    return response.data
}

const remove = async (id) => {
    const config = {
        headers: {
            Authorization: token
        }
    }

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response
}

const module = {
    getAll,
    create,
    setToken,
    modify,
    remove
}

export default module
