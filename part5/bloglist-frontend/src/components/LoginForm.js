import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'
import PropTypes from 'prop-types'

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

LoginForm.propTypes = {
    setUser: PropTypes.func.isRequired,
    setErrorMessage: PropTypes.func.isRequired
}

export default LoginForm
