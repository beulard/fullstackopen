const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    var sum = 0
    blogs.forEach(b => {
        sum += b.likes    
    })
    return sum
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    var mostLikes = 0
    blogs.forEach(b => {
        mostLikes = Math.max(mostLikes, b.likes)
    })
    return blogs.find(b => b.likes === mostLikes)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    
    const counts = _.countBy(blogs, 'author')
    
    const authorWithMostBlogs = _(counts).toPairs().orderBy([1], ['desc']).value()[0]

    return {
        author: authorWithMostBlogs[0],
        blogs: authorWithMostBlogs[1]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorsAndLikes = _(blogs).groupBy('author').map(author => {
        return author.reduce((prev, cur) => { 
            return {author: cur.author, likes: prev.likes + cur.likes }
        }, { author: '', likes: 0 })
    }).value()

    const sortedAuthorsAndLikes = _.sortBy(authorsAndLikes, ['likes'])

    const authorWithMostLikes = sortedAuthorsAndLikes[sortedAuthorsAndLikes.length - 1]

    return authorWithMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}