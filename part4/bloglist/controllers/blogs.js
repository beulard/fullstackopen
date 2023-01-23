const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', ['username', 'name', 'id'])
    response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const user = request.user
    if (!user) {
        return response.status(401).json({
            error: 'not authorized'
        })
    }

    // Associate with authenticated user
    blog.user = user.id
    
    blog.populate('user', ['username', 'name', 'id'])

    // Save the blog
    const result = await blog.save()

    // Add the blog to the user's blog list
    user.blogs = user.blogs.concat(result.id)
    await user.save()

    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (req, res) => {
    const user = req.user
    if (!user) {
        return res.status(401).json({
            error: 'not authorized'
        })
    }

    // Check that requesting user is the same as
    // user who created the entry
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.status(400).json({
            error: 'blog entry does not exist'
        })
    }

    if (blog.user.toString() === user.id.toString()) {
        await blog.remove()
        // Also remove the blog from the user's blog list
        user.blogs = user.blogs.filter(
            b => b._id.toString() !== req.params.id.toString()
        )
        await user.save()
    } else {
        return res.status(401).json({
            error: 'authenticated user did not create this blog entry'
        })
    }
    
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const returnedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', ['username', 'name', 'id'])
    res.status(200).json(returnedBlog)
})

module.exports = blogsRouter