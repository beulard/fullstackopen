import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = ({ setUser, setErrorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitLogin = async (event) => {
    event.preventDefault()
    console.log(username, password)
    try {
      const response = await loginService.login(username, password)
      console.log(response.data)
      setErrorMessage('')
      setUser(response.data)
      blogService.setToken(response.data.token)
      window.localStorage.setItem('loggedInUser', JSON.stringify(response.data))
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.error)
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={onSubmitLogin}>
        <div>username <input name='Username' type='text' onChange={({ target }) => setUsername(target.value)} /></div>
        <div>password <input name='Password' type='password' onChange={({ target }) => setPassword(target.value)} /></div>
        <button type='submit'>log in</button>
      </form>
    </div>
  )
}

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

const Notification = ({ message }) => {
  const style = {
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: 5,
    width: '50%',
  }
  if (message.length > 0) {
    return (
      <div style={style}>{message}</div>
    )
  }
}

const AddBlogForm = ({ addBlog, setErrorMessage }) => {
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
    }
  }

  return <div>
    <h2>add blog</h2>
    <form onSubmit={handleAddBlog}>
      <div>title <input type='text' onChange={({ target }) => setTitle(target.value)} /></div>
      <div>author <input type='text' onChange={({ target }) => setAuthor(target.value)} /></div>
      <div>url <input type='url' value={blogUrl} onChange={({ target }) => setUrl(target.value)} /></div>
      <button type='submit'>submit</button>
    </form>
  </div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const updateErrorMessage = message => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  // Obtain blogs from backend
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // Retrieve previously logged in user
  useEffect(() => {
    const previousUserJSON = window.localStorage.getItem('loggedInUser')
    if (previousUserJSON) {
      const previousUser = JSON.parse(previousUserJSON)
      setUser(previousUser)
      console.log('Retrieving user from local storage:')
      console.log(previousUser)
      blogService.setToken(previousUser.token)
    }
  }, [])

  const onLogout = (event) => {
    event.preventDefault()
    setErrorMessage('Logged out')
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }


  return <>
    <Notification message={errorMessage} />
    {user && <><div>Logged in as {user.name}</div>
      <div><button onClick={onLogout}>log out</button></div></>}
    {user === null
      ? <LoginForm setUser={setUser} setErrorMessage={updateErrorMessage} />
      : <>
        <AddBlogForm addBlog={blog => setBlogs([...blogs, blog])} setErrorMessage={updateErrorMessage} />
        <BlogList blogs={blogs} />
      </>
    }
  </>
}

export default App
