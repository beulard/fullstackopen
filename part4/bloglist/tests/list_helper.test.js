const listHelper = require('../utils/list_helper')
const blogApiHelper = require('./blog_api_helper')

test('dummy returns one', () => {
    const result = listHelper.dummy()
    expect(result).toBe(1)
})


describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(blogApiHelper.listWithOneBlog)
        expect(result).toBe(5)
    })
    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogApiHelper.listWithManyBlogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {
    test('is null for empty list', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toBe(null)
    })
    test('is correct for one blogs', () => {
        const result = listHelper.favoriteBlog(blogApiHelper.listWithOneBlog)
        expect(result).toEqual(blogApiHelper.listWithOneBlog[0])
    })
    test('is correct for many blogs', () => {
        const result = listHelper.favoriteBlog(blogApiHelper.listWithManyBlogs)
        expect(result).toEqual(blogApiHelper.listWithManyBlogs[2])
    })
})