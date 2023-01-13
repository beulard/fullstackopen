const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const users = await User.find({})
    // Choose a random user to associate
    const user = users[Math.floor(Math.random() * users.length)]
    blog.user = user.id

    // Save the blog
    const result = await blog.save()

    // Add the blog to the user's blog list
    user.blogs = user.blogs.concat(result.id)
    await user.save()

    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    console.log(req.body)
    const returnedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(returnedBlog)
})

module.exports = blogsRouter