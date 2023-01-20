import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = ({ setUsername, setPassword, onSubmitLogin }) => {
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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // Retrieve previously logged in user
  useEffect(() => {
    const previousUser = window.localStorage.getItem('loggedInUser')
    if (previousUser) {
      setUser(JSON.parse(previousUser))
    }
  }, [])

  const onLogout = (event) => {
    event.preventDefault()
    setErrorMessage('Logged out')
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  const onSubmitLogin = async (event) => {
    event.preventDefault()
    console.log(username, password)
    try {
      const response = await loginService.login(username, password)
      console.log(response.data)
      setErrorMessage('')
      setUser(response.data)
      window.localStorage.setItem('loggedInUser', JSON.stringify(response.data))
    } catch(error) {
      console.log(error)
      setErrorMessage(error.response.data.error)
    }
  }

  return <>
    <Notification message={errorMessage} />
    {user && <><div>Logged in as {user.name}</div>
      <div><button onClick={onLogout}>log out</button></div></>}
    {user === null
      ? <LoginForm setUsername={setUsername} setPassword={setPassword} onSubmitLogin={onSubmitLogin} />
      : <BlogList blogs={blogs} />}
  </>
}

export default App
