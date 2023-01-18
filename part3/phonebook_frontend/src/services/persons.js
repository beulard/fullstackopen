import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(response => response.data)
}

const addPerson = (person) => {
    const req = axios.post(baseUrl, person)
    return req.then(response => response.data)
}

const deletePerson = (id) => {
    const req = axios.delete(baseUrl + `/${id}`)
    return req.then(response => response.data)
}

const updatePerson = (id, person) => {
    const req = axios.put(baseUrl + `/${id}`, person)
    return req.then(response => response.data)
}

const module = {
    getAll,
    addPerson,
    deletePerson,
    updatePerson
}

export default module;