const mongoose = require('mongoose')
const config = require('../utils/config')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_api_helper')

const api = supertest(app)

let token = ''
let rootUser = {}

beforeAll(async () => {
    await mongoose.disconnect()
    await mongoose.connect(config.MONGODB_URI)
    // Delete all users
    await User.deleteMany({})
    // Register a default root user
    const newUser = await api
        .post('/api/users')
        .send({ username: 'root', name: 'super', password: 'password' })
        .expect(201)
    rootUser = newUser.body
    // Login and get the token
    const auth = await api
        .post('/api/login')
        .send({ username: 'root', password: 'password' })
        .expect(200)
    token = auth.body.token
})

beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blog of helper.listWithManyBlogs) {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
    }
})

describe('adding a blog', () => {
    test('with POST creates a new blog entry with the right content', async () => {
        const newBlog = {
            title: 'A recently created blog entry',
            author: 'Matthias Dubouchet',
            url: 'http://github.com/beulard',
            likes: 99999,
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        // Now make a GET request to check things
        const blogs = await api.get('/api/blogs')
        expect(blogs.body).toHaveLength(helper.listWithManyBlogs.length + 1)
        expect(blogs.body[blogs.body.length - 1].content).toBe(newBlog.content)
    })
    test('without a token fails with status 401', async () => {
        const newBlog = {
            title: 'A recently created blog entry',
            author: 'Matthias Dubouchet',
            url: 'http://github.com/beulard',
            likes: 99999,
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
}

)

describe('blog list', () => {
    test('GET returns the right number of entries', async () => {
        const blogs = await api.get('/api/blogs')
        expect(blogs.body).toHaveLength(helper.listWithManyBlogs.length)
    })
    test('unique identifier is named id', async () => {
        const blogs = await api.get('/api/blogs')
        blogs.body.forEach(blog => { expect(blog.id).toBeDefined() })
    })
    test('if likes property is missing, it defaults to zero', async () => {
        const newBlog = {
            title: 'A recently created blog entry',
            author: 'Matthias Dubouchet',
            url: 'http://github.com/beulard'
        }
        const resp = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        expect(resp.body.likes).toBeDefined()
        expect(resp.body.likes).toEqual(0)
    })
    test('if title or url is missing, backend responds with 400', async () => {
        const blogWithoutTitle = {
            author: 'Matthias Dubouchet',
            url: 'http://github.com/beulard',
            likes: 999
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutTitle)
            .expect(400)

        const blogWithoutUrl = {
            title: 'A recently created blog entry',
            author: 'Matthias Dubouchet',
            likes: 999
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutUrl)
            .expect(400)
    })
})

describe('DELETE on a blog entry', () => {
    test('removes the entry and returns status 204 if id is found', async () => {
        const blogsBefore = await api.get('/api/blogs')
        const firstEntry = blogsBefore.body[0]

        await api
            .delete(`/api/blogs/${firstEntry.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        // GET the remaining entries and check that the one we DELETEd is gone
        const blogsAfter = await api.get('/api/blogs')
        expect(blogsAfter.body).not.toContain(firstEntry)
    })
    test('without a token returns status 401', async () => {
        const blogsBefore = await api.get('/api/blogs')
        const firstEntry = blogsBefore.body[0]

        await api
            .delete(`/api/blogs/${firstEntry.id}`)
            .expect(401)
    })
})

describe('PUT on a blog entry', () => {
    test('updates the entry with the correct information', async () => {
        const blogsBefore = await api.get('/api/blogs')
        const initialEntry = blogsBefore.body[0]
        const replacementEntry = {
            author: 'Modified Author',
            title: 'Modified Title',
            likes: initialEntry.likes + 1,
            url: 'http://google.com',
            user: rootUser.id.toString()
        }
        const returnedEntry = await api.put(`/api/blogs/${initialEntry.id}`).send(replacementEntry).expect(200)
        expect(returnedEntry.body).toEqual({ ...replacementEntry, id: initialEntry.id })
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})