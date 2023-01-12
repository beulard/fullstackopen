const mongoose = require('mongoose')
const config = require('../utils/config')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blog_api_helper')

const api = supertest(app)

beforeAll(async () => {
    await mongoose.disconnect()
    await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogs = helper.listWithManyBlogs.map(blog => new Blog(blog))
    const promises = blogs.map(b => b.save())
    await Promise.all(promises)
})

describe('blog list', () => {
    test('GET returns the right number of entries', async () => {
        const blogs = await api.get('/api/blogs')
        expect(blogs.body).toHaveLength(helper.listWithManyBlogs.length)
    })
    test('unique identifier is named id', async () => {
        const blogs = await api.get('/api/blogs')
        blogs.body.forEach(blog => { expect(blog.id).toBeDefined() })
    })
    test('POST creates a new blog entry with the right content', async () => {
        const newBlog = {
            title: 'A recently created blog entry',
            author: 'Matthias Dubouchet',
            url: 'http://github.com/beulard',
            likes: 99999,
        }
        await api.post('/api/blogs').send(newBlog).expect(201)

        // Now make a GET request to check things
        const blogs = await api.get('/api/blogs')
        expect(blogs.body).toHaveLength(helper.listWithManyBlogs.length + 1)
        expect(blogs.body[blogs.body.length-1].content).toBe(newBlog.content)
    })
    test('if likes property is missing, it defaults to zero', async () => {
        const newBlog = {
            title: 'A recently created blog entry',
            author: 'Matthias Dubouchet',
            url: 'http://github.com/beulard'
        }
        const resp = await api.post('/api/blogs').send(newBlog).expect(201)

        expect(resp.body.likes).toBeDefined()
        expect(resp.body.likes).toEqual(0)
    })
    test('if title or url is missing, backend responds with 400', async () => {
        const blogWithoutTitle = {
            author: 'Matthias Dubouchet',
            url: 'http://github.com/beulard',
            likes: 999
        }
        await api.post('/api/blogs').send(blogWithoutTitle).expect(400)
        
        const blogWithoutUrl = {
            title: 'A recently created blog entry',
            author: 'Matthias Dubouchet',
            likes: 999
        }
        await api.post('/api/blogs').send(blogWithoutUrl).expect(400)
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})