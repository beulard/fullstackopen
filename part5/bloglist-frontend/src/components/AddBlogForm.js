import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const AddBlogForm = ({ addBlog, setErrorMessage, logoutUser }) => {
    const [blogTitle, setTitle] = useState('')
    const [blogAuthor, setAuthor] = useState('')
    const [blogUrl, setUrl] = useState('http://example.org')

    const handleAddBlog = async (event) => {
        event.preventDefault()
        try {
            const response = await blogService.create({ title: blogTitle, author: blogAuthor, url: blogUrl })
            console.log(response)
            addBlog(response)
            setErrorMessage('Added blog: ' + response.title + ' by ' + response.author)
        } catch (error) {
            console.error(error)
            setErrorMessage('Error: ' + error.response.data.error)
            if (error.response.data.error === 'token expired') {
                logoutUser()
            }
        }
    }

    return <div>
        <form onSubmit={handleAddBlog}>
            <div>title <input type='text' placeholder='title' onChange={({ target }) => setTitle(target.value)} /></div>
            <div>author <input type='text' placeholder='author' onChange={({ target }) => setAuthor(target.value)} /></div>
            <div>url <input type='url' placeholder='url' value={blogUrl} onChange={({ target }) => setUrl(target.value)} /></div>
            <button type='submit'>submit</button>
        </form>
    </div>
}

AddBlogForm.propTypes = {
    addBlog: PropTypes.func.isRequired,
    setErrorMessage: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired
}

export { AddBlogForm }
