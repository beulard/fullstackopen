import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Blog } from './Blog'
import axios from 'axios'

describe('<Blog />', () => {
    let container
    const mockHandler = jest.fn()
    const blog = {
        title: 'Blog title',
        author: 'Matthias Dubouchet',
        url: 'http://example.org/blog',
        user: {
            username: 'beulard',
            name: 'Matthias Dubouchet'
        },
        likes: 420
    }

    beforeEach(() => {
        container = render(
            <Blog blog={blog}
                modifyBlog={mockHandler}
                deleteBlog={() => { }}
                setErrorMessage={(err) => { }}
                username='beulard'
                logoutUser={() => { }}
            />
        ).container
    })

    it('renders content', () => {
        const div = container.querySelector('.blog')
        expect(div).toHaveTextContent(blog.title + ' by ' + blog.author)
    })
    it('displays URL and likes when shown', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show')

        await user.click(button)

        const urlDiv = container.querySelector('.blogUrl')
        expect(urlDiv).toBeVisible()
        expect(urlDiv).toHaveTextContent(blog.url)

        const likesCount = container.querySelector('.likesCount')
        expect(likesCount).toBeVisible()
        expect(likesCount).toHaveTextContent(blog.likes + ' likes')
    })
    it('calls the like event handler if the button is clicked', async () => {
        jest.spyOn(axios, 'put')
        const user = userEvent.setup()
        const button = screen.getByText('like')

        await user.click(button)

        expect(axios.put).toHaveBeenCalledTimes(1)
    })
})