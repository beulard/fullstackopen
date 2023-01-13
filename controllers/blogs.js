const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const token = request.token

    const identity = jwt.verify(token, process.env.SECRET)

    const user = await User.findOne({
        username: identity.username
    })
    // Associate with authenticated user
    blog.user = user.id

    // Save the blog
    const result = await blog.save()

    // Add the blog to the user's blog list
    user.blogs = user.blogs.concat(result.id)
    await user.save()

    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (req, res) => {
    const token = req.token

    const identity = jwt.verify(token, process.env.SECRET)
    
    const user = await User.findOne({
        username: identity.username
    })
    // Check that requesting user is the same as
    // user who created the entry
    const blog = await Blog.findById(req.params.id)

    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(req.params.id)
    } else {
        return res.status(401).json({
            error: 'authenticated user did not create this blog entry'
        })
    }
    
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const returnedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(returnedBlog)
})

module.exports = blogsRouter