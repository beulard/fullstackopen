import { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import { AddBlogForm } from './components/AddBlogForm'
import LoginForm from './components/LoginForm'
import { Notification } from './components/Notification'
import { BlogList } from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const addBlogRef = useRef()

  const updateErrorMessage = message => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  // Obtain blogs from backend
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [user])

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

  const logoutUser = () => {
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  const onLogout = (event) => {
    event.preventDefault()
    setErrorMessage('Logged out')
    logoutUser()
  }

  return <>
    <Notification message={errorMessage} />
    {user && <><div>Logged in as {user.name}</div>
      <div><button onClick={onLogout}>log out</button></div></>}
    {user === null
      ? <LoginForm setUser={setUser} setErrorMessage={updateErrorMessage} />
      : <>
        <h2>add blog</h2>
        <Togglable buttonLabel='add blog' ref={addBlogRef}>
          <AddBlogForm addBlog={
            (blog) => {
              setBlogs([...blogs, blog])
              addBlogRef.current.toggleVisibility()
            }
          } setErrorMessage={updateErrorMessage} logoutUser={logoutUser} />
        </Togglable>
        <BlogList blogs={blogs} setBlogs={setBlogs} setErrorMessage={updateErrorMessage} username={user?.username} logoutUser={logoutUser} />
      </>
    }
  </>
}

export default App
