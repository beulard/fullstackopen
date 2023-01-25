import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddBlogForm } from './AddBlogForm'
import blogService from '../services/blogs'

describe('<AddBlogForm />', () => {

    beforeEach(() => {
        render(
            <AddBlogForm addBlog={() => {}}
                setErrorMessage={() => {}}
                logoutUser={() => {}}
            />
        )
    })
    it('calls the event handler with the right details when blog is created', async () => {
        jest.spyOn(blogService, 'create')
        const user = userEvent.setup()
        const titleBox = screen.getByPlaceholderText('title')
        const authorBox = screen.getByPlaceholderText('author')
        const urlBox = screen.getByPlaceholderText('url')

        await user.type(titleBox, 'Blog title test')
        await user.type(authorBox, 'Author test')
        await user.clear(urlBox)
        await user.type(urlBox, 'http://blog-url.org')

        const button = screen.getByText('submit')
        await user.click(button)

        expect(blogService.create).toHaveBeenCalledTimes(1)
        expect(blogService.create).toHaveBeenCalledWith({
            title: 'Blog title test',
            author: 'Author test',
            url: 'http://blog-url.org'
        })
    })
})