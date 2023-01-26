import { Togglable } from './Togglable'
import blogService from '../services/blogs'

const Blog = ({ blog, modifyBlog, deleteBlog, setErrorMessage, username, logoutUser }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleError = (error) => {
        console.error(error.response.data.error)
        setErrorMessage('Error: ' + error.response.data.error)
        if (error.response.data.error === 'token expired') {
            logoutUser()
        }
    }

    const handleLike = async (blog) => {
        const newBlog = {
            user: blog.user.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1
        }
        try {
            const returnedBlog = await blogService.modify(blog.id, newBlog)
            // setDisplayedBlog(returnedBlog)
            modifyBlog(returnedBlog)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = async (blog) => {
        if (window.confirm(`Remove entry ${blog.title}?`)) {
            try {
                await blogService.remove(blog.id)
                deleteBlog()
            } catch (error) {
                handleError(error)
            }
        }
    }

    return <div className='blog' style={blogStyle}>
        {blog.title} by {blog.author}
        <Togglable buttonLabel='show' hideLabel='hide'>
            <div className='blogUrl'>{blog.url}</div>
            <div className='likesCount'>{blog.likes} likes <button onClick={() => { handleLike(blog) }}>like</button></div>
            <div>Added by {blog.user.name}</div>
            {username === blog.user.username && <div><button onClick={() => { handleDelete(blog) }}>remove</button></div>}
        </Togglable>
    </div>
}

const BlogList = ({ blogs, setBlogs, setErrorMessage, username, logoutUser }) => {
    const modifyBlog = (id, newBlog) => {
        const updatedBlogs = [...blogs]
        setBlogs(updatedBlogs.map(blog => blog.id === id ? newBlog : blog))
    }

    const deleteBlog = (id) => {
        setBlogs(blogs.filter(blog => blog.id !== id))
    }

    return (
        <div id='blogList'>
            <h2>blogs</h2>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog} modifyBlog={(newBlog) => modifyBlog(blog.id, newBlog)}
                    deleteBlog={() => { deleteBlog(blog.id) }}
                    setErrorMessage={setErrorMessage} username={username} logoutUser={logoutUser} />
            )}
        </div>
    )
}

export { Blog, BlogList }
